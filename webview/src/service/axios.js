import axiosModule from 'axios';
import MockAdapter from 'axios-mock-adapter';
import queryParametersParser from './queryParametersParser';

const axios = axiosModule.create({
    baseURL: 'https://my-api.domain.com',
    timeout: 30000,
    withCredentials: true
});

const mock = new MockAdapter(axios);

const save = {};

mock.onPost('/login').reply(() => {
    return new Promise((resolve) => {
        resolve([200, { success: true, token: 'abc_token' }]);
    });
});

mock.onGet('/sites').reply((config) => {
    const number = 5 + Math.floor(Math.random() * 5);
    let sites = Array(number).fill('').map((dummy, index) => ({
        id: index,
        name: 'Trạm điện số ' + (index + 1),
        isFail: Math.random() > 0.8,
        duration: Math.random() * 2 + 7,
        product: Math.random() * 7 + 40,
    }));

    if (save[config.url]) {
        sites = save[config.url];
    } else {
        save[config.url] = sites;
    }

    return new Promise((resolve) => {
        resolve([200, { sites }]);
    });
});

mock.onGet(/\/site\/overview\?.*/).reply((config) => {
    const url = config.url;
    const id = queryParametersParser.parse(url.split('?')[1])['id'];
    let data = {
        id,
        current: Math.random() * 10 + 20,
        max: 35,
    };

    if (save[url]) {
        data = save[url];
    } else if (save['/sites']) {
        data = { ...save['/sites'][parseInt(id)], ...data };
    } else {
        data = {
            ...data,
            duration: Math.random() * 2 + 7,
            product: Math.random() * 7 + 40,
        };
    }

    data.current = Math.random() * 10 + 20;
    data.product += Math.random() * 0.05;
    data.duration += 0.001;

    save[url] = data;
    console.log('here');

    return new Promise((resolve) => {
        setTimeout(() => resolve([200, data]), 2000);
    });
});

mock.onGet(/\/site\/devices\?.*/).reply((config) => {
    const url = config.url;
    const id = queryParametersParser.parse(url.split('?')[1])['id'];
    let data = {
        id,
        current: Math.random() * 10 + 20,
        max: 35,
    };

    if (save[url]) {
        data = save[url];
    } else if (save['/sites']) {
        data = { ...save['/sites'][parseInt(id)], ...data };
    } else {
        data = {
            ...data,
            duration: Math.random() * 2 + 7,
            product: Math.random() * 7 + 40,
        };
    }

    data.current = Math.random() * 10 + 20;
    data.product += Math.random() * 0.05;
    data.duration += 0.001;

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});

mock.onGet(/\/chart\?.*/).reply((config) => {
    const url = config.url;
    const query = queryParametersParser.parse(url.split('?')[1]);
    const notes = parseInt(query['notes']);

    let data;
    if (save[url]) {
        data = save[url];
    } else {
        data = Array(notes).fill('').map(() => Math.random() * 100);
    }

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});


export default axios;