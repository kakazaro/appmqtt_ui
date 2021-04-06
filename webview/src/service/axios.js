import axiosModule from 'axios';
import MockAdapter from 'axios-mock-adapter';

const axios = axiosModule.create({
    baseURL: 'https://my-api.domain.com',
    timeout: 30000,
    withCredentials: true
});

const mock = new MockAdapter(axios);

mock.onPost('/login').reply(() => {
    return new Promise((resolve) => {
        resolve([200, { success: true, token: 'abc_token' }]);
    });
});

mock.onGet('/sites').reply(() => {
    const number = 5 + Math.floor(Math.random() * 5);
    const sites = Array(number).fill('').map((dummy, index) => ({
        name: 'Trạm điện số ' + index,
        isFail: Math.random() > 0.8,
        duration: Math.random() * 2 + 7,
        product: Math.random() * 7 + 40,
    }));

    return new Promise((resolve) => {
        resolve([200, { sites }]);
    });
});


export default axios;