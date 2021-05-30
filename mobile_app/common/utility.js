import constant from './constant';

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
    EVENT_TYPE: {
        FAULT: {
            id: 'fault',
            label: 'Sự cố'
        },
        ALARM: {
            id: 'alarm',
            label: 'Cảnh báo'
        }
    },
    EVENT_STATUS: {
        ACTIVE: {
            id: 'active',
            label: 'Chưa xử lý'
        },
        PROCESSING: {
            id: 'processing',
            label: 'Đang xử lý'
        },
        RESOLVED: {
            id: 'resolved',
            label: 'Đã xử lý'
        },
        UNCONFIRMED: {
            id: 'unconfirmed',
            label: 'Không xác định'
        }
    },
    USER_ROLES: {
        US: {
            id: 'US',
            label: 'Người dùng thường',
            icon: 'account'
        },
        AD: {
            id: 'AD',
            label: 'Nhân viên vận hành',
            icon: 'account-hard-hat'
        },
        SA: {
            id: 'SA',
            label: 'Quản trị viên',
            icon: 'account-tie'
        }
    },
    findUnit(values, baseUnit = 'W', multiple = 1) {
        let unit = baseUnit;
        let div = 1;

        if (!values?.length) {
            return { unit, div: div / multiple };
        }

        const value = values.reduce((max, cur) => cur > max ? cur : max, 0);

        if (value * multiple > 1000 * 1000 * 1000) {
            unit = 'G';
            div = 1000 * 1000 * 1000;
        } else if (value * multiple > 1000 * 1000) {
            unit = 'M';
            div = 1000 * 1000;
        } else if (value * multiple > 1000) {
            unit = 'k';
            div = 1000;
        } else {
            unit = '';
            div = 1;
        }

        return { unit: unit + baseUnit, div: div / multiple };
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

        even = even.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // return even + '.' + Math.floor(odd * 100);

        return { value: even, unit: unit };
    },
    makeupPower(value, postfix = '') {
        let { unit, div } = this.findUnit([value], 'W', 1);
        return { value: Math.floor((value / div) * 10) / 10, unit: unit + postfix };
    },
    makeupProduct(value) {
        let { unit, div } = this.findUnit([value], 'Wh', 1000);
        return { value: Math.floor((value / div) * 10) / 10, unit };
    },
    getDeviceTagName(value) {
        const tags = Object.keys(constant.DEVICE_TAG_NAME);
        const tag = tags.find(t => t.trim().toLowerCase() === (value || '').trim().toLowerCase());
        if (tag) {
            return constant.DEVICE_TAG_NAME[tag];
        }

        return value;
    }
};