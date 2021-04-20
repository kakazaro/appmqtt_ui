export default {
    STATUS: {
        FAULT: {
            id: 'fault',
            label: 'Sự cố'
        },
        ALARM: {
            id: 'alarm',
            label: 'Cảnh báo'
        },
        OFFLINE: {
            id: 'offline',
            label: 'Không hoạt động'
        },
        NORMAL: {
            id: 'normal',
            label: 'Bình thường'
        }
    },
    makeupMoney(value) {
        let even = Math.floor(value);
        // const odd = value - even;
        let unit = '';
        if (even > 1000 * 1000 * 1000) {
            unit = 'B';
            even = Math.floor(even / (1000 * 1000 * 100)) / 10;
        } else if (even > 1000 * 1000) {
            unit = 'M';
            even = Math.floor(even / (1000 * 100)) / 10;
        } else if (even > 1000) {
            unit = 'K';
            even = Math.floor(even / 100) / 10;
        }

        // even = even.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // return even + '.' + Math.floor(odd * 100);

        return { value: even, unit: unit + 'đ' };
    },
    makeupPower(value, postfix = '') {
        let even = value;
        let unit = '';
        if (value > 1000 * 1000 * 1000) {
            unit = 'GW';
            even = Math.floor(value / (100 * 1000 * 1000)) / 10;
        } else if (value > 1000 * 1000) {
            unit = 'MW';
            even = Math.floor(value / (100 * 1000)) / 10;
        } else if (value > 1000) {
            unit = 'KW';
            even = Math.floor(value / (100)) / 10;
        } else {
            unit = 'W';
            even = Math.floor(value * 10) / 10;
        }

        return { value: even, unit: unit + postfix };
    },
    makeupProduct(value) {
        let even = value;
        let unit = '';
        if (value > 1000 * 1000) {
            unit = 'GWh';
            even = Math.floor(value / (100 * 1000)) / 10;
        } else if (value > 1000) {
            unit = 'MWh';
            even = Math.floor(value / (100)) / 10;
        } else if (value > 0) {
            unit = 'KWh';
            even = Math.floor(value * 10) / 10;
        } else {
            unit = 'Wh';
            even = Math.floor(value * 10000) / 10;
        }

        return { value: even, unit };
    },
    findProductUnit(values) {
        let unit = 'W';
        let div = 1;

        if (!values?.length) {
            return { unit, div };
        }

        const value = values.reduce((max, cur) => cur > max ? cur : max, 0);

        if (value > 1000 * 1000 * 1000) {
            unit = 'GW';
            div = 1000 * 1000 * 1000;
        } else if (value > 1000 * 1000) {
            unit = 'MW';
            div = 1000 * 1000;
        } else if (value > 1000) {
            unit = 'kW';
            div = 1000;
        } else {
            unit = 'W';
            div = 1;
        }

        return { unit, div };
    }

};