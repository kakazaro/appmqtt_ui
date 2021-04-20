import axiosModule from 'axios';
import MockAdapter from 'axios-mock-adapter';
import queryParametersParser from './queryParametersParser';
import moment from 'moment';
import utility from './utility';

const axios = axiosModule.create({
    baseURL: 'https://my-api.domain.com',
    timeout: 30000,
    withCredentials: true
});

const mock = new MockAdapter(axios);

const save = {};
const chart = {};
const statusKey = Object.keys(utility.STATUS);

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
        status: utility.STATUS[statusKey[Math.floor(Math.random() * statusKey.length)]].id,
        workingHours: Math.random() * 2 + 7,
        product: getChart(index + '', Date.now(), 'h', 'd').series.reduce((sum, cur) => sum + cur, 0),
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

const createHoursChart = (id, time, current) => {
    let timeMoment = moment(time);
    if (!chart[id]) {
        chart[id] = {};
    }

    if (chart[id][time]) {
        if (timeMoment.isSame(current, 'h')) {
            chart[id][time] += 5 * Math.random();
        }
    } else {
        if (timeMoment.isAfter(current, 'h')) {
            chart[id][time] = 0;
        } else {
            chart[id][time] = 3600 * Math.random() + 0.0000001;
        }
    }
    return chart[id][time];
};

const buildProductChart = (id, time, space, current = moment(new Date())) => {
    if (space === 'h') {
        return createHoursChart(id, time, current);
    } else {
        let sum = 0;
        const saveTimeMoment = moment(time);
        let timeMoment = moment(time);
        do {
            sum += createHoursChart(id, time, current);
            timeMoment = timeMoment.add(1, 'h');
        } while (timeMoment.isSame(saveTimeMoment, space));
        return sum;
    }
};

const getChart = (id, time, space, start) => {
    const current = moment(new Date());
    let m = moment(new Date(time));

    let pointTime = moment(new Date(time)).startOf(start);
    const times = [];
    do {
        const t = pointTime.toDate().getTime();
        pointTime = pointTime.add(1, space);
        times.push(t);
    } while (m.get(start) === pointTime.get(start));

    return {
        series: [...times].map(time => {
            return buildProductChart(id, time, space, current) / 100;
        }),
        times
    };
};

const saveOverview = {};

mock.onGet(/\/site\/overview\?.*/).reply((config) => {
    const url = config.url;
    const query = queryParametersParser.parse(url.split('?')[1]);
    const id = query['id'];

    let data = {
        id,
        curSumActPower: Math.random() * 10 + 20,
    };

    if (!saveOverview[id]) {
        const ratedSumPower = Math.random() * 5 + 30;
        const allSumEnergy = Math.random() * 15000 + 20000;
        saveOverview[id] = { ratedSumPower, allSumEnergy };
    }

    const chart = getChart(id, Date.now(), 'h', 'd');

    data.todaySumEnergy = chart.series.reduce((sum, cur) => sum + cur, 0);
    data = { ...data, ...saveOverview[id] };


    return new Promise((resolve) => {
        setTimeout(() => resolve([200, data]), 100);
    });
});

mock.onGet(/\/site\/devices\?.*/).reply((config) => {
    const url = config.url;
    let data;

    if (save[url]) {
        data = save[url];
    } else {
        data = Array(10 + Math.floor(Math.random() * 5)).fill('').map((v, index) => ({
            id: index,
            name: 'Inverter No.' + (index + 1),
            status: utility.STATUS[statusKey[Math.floor(Math.random() * statusKey.length)]].id,
            curActPower: Math.random() * 10 + 3,
            todayEnergy: Math.random() * 7 + 10,
        }));
    }

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});

// const historyExample = [
//     {
//         status: 'Ổn định',
//         code: 0,
//     },
//     {
//         status: 'Sự cố',
//         code: 1,
//     },
//     {
//         status: 'Nguy cơ',
//         code: 2,
//     }
// ];

// const possibleCode = [
//     [1, 2], [0, 2], [0]
// ];

const issueCauseExample = [
    'Rò rỉ đường dây', 'Đoản mạch', 'Hỏng biến tần', 'Hư hại do thời tiết', 'Hỏng cảm biến', 'Chưa xác định'
];

// const noIssueCause = 'Hệ thông hoạt động bình thường';

const eventTypeKeys = Object.keys(utility.EVENT_TYPE);
const eventStatusKeys = Object.keys(utility.EVENT_STATUS);

mock.onGet(/\/site\/events\?.*/).reply((config) => {
    const url = config.url;
    // const id = queryParametersParser.parse(url.split('?')[1])['id'];
    let data;
    // , site;

    // if (save['/sites']) {
    //     site = save['/sites'][parseInt(id)];
    // }

    if (save[url]) {
        data = save[url];
    } else {
        data = [];

        let date = moment(new Date());
        const l = 10 + Math.floor(Math.random() * 5);
        for (let i = 1; i <= l; i++) {
            date = date.add(-1 * (0.4 + Math.random() * 60), 'hour');
            data.push({
                caption: issueCauseExample[Math.floor(Math.random() * issueCauseExample.length)],
                time: date.toDate().getTime(),
                eventType: utility.EVENT_TYPE[eventTypeKeys[Math.floor(Math.random() * eventTypeKeys.length)]].id,
                status: utility.EVENT_STATUS[eventStatusKeys[Math.floor(Math.random() * eventStatusKeys.length)]].id,
            });
        }

    }

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});

mock.onGet(/\/site\/chart\?.*/).reply((config) => {
    const url = config.url;
    const query = queryParametersParser.parse(url.split('?')[1]);
    const id = parseInt(query['id']);
    let time = parseInt(query['time']);
    const space = query['space'];
    const start = query['start'];

    const data = getChart(id, time, space, start);

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});


export default axios;