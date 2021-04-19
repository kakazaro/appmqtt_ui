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

mock.onPost('/login').reply(() => {
    return new Promise((resolve) => {
        resolve([200, { success: true, token: 'abc_token' }]);
    });
});

mock.onGet('/sites').reply((config) => {
    const number = 5 + Math.floor(Math.random() * 5);
    const statusKey = Object.keys(utility.STATUS);

    let sites = Array(number).fill('').map((dummy, index) => ({
        id: index,
        name: 'Trạm điện số ' + (index + 1),
        status: utility.STATUS[statusKey[Math.floor(Math.random() * statusKey.length)]].id,
        workingHours: Math.random() * 2 + 7,
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

const buildProductChart = (time, space, current = moment(new Date())) => {
    let timeMoment = moment(time);

    if (space === 'h') {
        if (chart[time]) {
            if (timeMoment.isSame(current, 'h')) {
                chart[time] += 5 * Math.random();
            }
        } else {
            if (timeMoment.isAfter(current, 'h')) {
                chart[time] = 0;
            } else {
                chart[time] = 3600 * Math.random() + 0.0000001;
            }
        }
        return chart[time];
    } else {
        let sum = 0;
        const saveTimeMoment = moment(time);
        do {
            sum += buildProductChart(timeMoment, 'h', current);
            timeMoment = timeMoment.add(1, 'h');
        } while (timeMoment.isSame(saveTimeMoment, space));
        return sum;
    }
};

mock.onGet(/\/site\/overview\?.*/).reply((config) => {
    const url = config.url;
    const query = queryParametersParser.parse(url.split('?')[1]);
    const id = query['id'];
    let time = parseInt(query['time']);
    // let notes = parseInt(query['notes']);
    let space = query['space'];
    let start = query['start'];

    let data = {
        id,
        current: Math.random() * 10 + 20,
        max: 35,
    };

    const current = moment(new Date());
    let m = moment(new Date(time));

    let pointTime = moment(new Date(time)).startOf(start);
    const times = [];
    do {
        const t = pointTime.toDate().getTime();
        pointTime = pointTime.add(1, space);
        times.push(t);
    } while (m.get(start) === pointTime.get(start));

    const series = [...times].map(time => {
        return buildProductChart(time, space, current) / 100;
    });

    data.product = series.reduce((sum, cur) => sum + cur, 0);
    data.chart = { series, times };

    // if (save[url]) {
    //     data = save[url];
    // } else if (save['/sites']) {
    //     data = { ...save['/sites'][parseInt(id)], ...data };
    // } else {
    //     data = {
    //         ...data,
    //         product: Math.random() * 7 + 40,
    //     };
    // }

    // data.current = Math.random() * 10 + 20;
    // data.product = Math.random() * 0.05;

    // save[url] = data;

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
            isFail: Math.random() > 0.8,
            duration: Math.random() * 2 + 7,
            current: Math.random() * 10 + 3,
            product: Math.random() * 7 + 10,
        }));
    }

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});

const historyExample = [
    {
        status: 'Ổn định',
        code: 0,
    },
    {
        status: 'Sự cố',
        code: 1,
    },
    {
        status: 'Nguy cơ',
        code: 2,
    }
];

const possibleCode = [
    [1, 2], [0, 2], [0]
];

const issueCauseExample = [
    'Rò rỉ đường dây', 'Đoản mạch', 'Hỏng biến tần', 'Hư hại do thời tiết', 'Hỏng cảm biến', 'Chưa xác định'
];

const noIssueCause = 'Hệ thông hoạt động bình thường';

mock.onGet(/\/site\/history\?.*/).reply((config) => {
    const url = config.url;
    const id = queryParametersParser.parse(url.split('?')[1])['id'];
    let data, site;

    if (save['/sites']) {
        site = save['/sites'][parseInt(id)];
    }

    if (save[url]) {
        data = save[url];
    } else {
        const firstCode = site?.isFail ? 1 : 0;
        data = [{
            timeStamp: 0,
            cause: firstCode !== 0 ? issueCauseExample[Math.floor(Math.random() * issueCauseExample.length)] : noIssueCause,
            ...historyExample[firstCode]
        }];

        let date = moment(new Date());
        const l = 10 + Math.floor(Math.random() * 5);
        for (let i = 1; i <= l; i++) {
            date = date.add(-1 * (0.4 + Math.random() * 60), 'hour');

            const before = data[i - 1];
            // Find the early code
            const code = possibleCode[before.code][Math.floor(Math.random() * possibleCode[before.code].length)];

            let cause = issueCauseExample[Math.floor(Math.random() * issueCauseExample.length)];
            if (code === 2 && before.code === 1) {
                cause = before.cause;
            } else if (code === 0) {
                cause = noIssueCause;
            }

            data.push({
                timeStamp: date.toDate().getTime(),
                ...historyExample[code],
                cause,
            });
        }

    }

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});

mock.onGet(/\/chart\?.*/).reply((config) => {
    const url = config.url;
    const query = queryParametersParser.parse(url.split('?')[1]);
    const notes = parseInt(query['notes']);
    let time = parseInt(query['time']);
    time = moment(new Date(time));
    const space = query['space'];

    let data;
    if (save[url]) {
        data = save[url];
    } else {
        const series = Array(notes).fill('').map(() => Math.random() * 100);
        let times = Array(notes).fill('').map(() => {
            const cur = time.toDate().getTime();
            time = time.add(-1, space);
            return cur;
        });
        times = times.reverse();
        data = {
            series, times
        };
    }

    save[url] = data;

    return new Promise((resolve) => {
        resolve([200, data]);
    });
});


export default axios;