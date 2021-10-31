import constant from './constant';
import { colors } from './themes';

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
            label: 'Lỗi thiệt hại',
            icon: 'alert-decagram',
            color: colors.fault
        },
        ALARM: {
            id: 'alarm',
            label: 'Cảnh báo',
            icon: 'bell-alert',
            color: colors.alarm
        }
    },
    EVENT_STATUS: {
        ACTIVE: {
            id: 'active',
            label: 'Chưa xử lý',
            color: colors.fault
        },
        PROCESSING: {
            id: 'processing',
            label: 'Đang xử lý',
            color: colors.alarm
        },
        RESOLVED: {
            id: 'resolved',
            label: 'Đã xử lý',
            color: colors.normal
        },
        UNCONFIRMED: {
            id: 'unconfirmed',
            label: 'Chưa xác nhận xử lý',
            color: colors.offline
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
            label: 'Admin',
            icon: 'account-hard-hat'
        },
        SA: {
            id: 'SA',
            label: 'System Admin',
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

        if (value * multiple > 1000 * 1000 * 1000 * 100) {
            unit = 'G';
            div = 1000 * 1000 * 1000;
        } else if (value * multiple > 1000 * 1000 * 100) {
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
            unit = 'tỷ';
            even = Math.floor(even / (1000 * 1000 * 100)) / 10;
        } else if (even > 1000 * 1000) {
            unit = 'triệu';
            even = Math.floor(even / (1000 * 100)) / 10;
        } else if (even > 1000) {
            unit = 'nghìn';
            even = Math.floor(even / 100) / 10;
        }

        even = even.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // return even + '.' + Math.floor(odd * 100);

        return { value: even, unit: unit };
    },
    makeupPower(value = 0, postfix = '') {
        let { unit, div } = this.findUnit([value], 'W', 1);
        return { value: Math.floor((value / div) * 10) / 10, unit: unit + postfix };
    },
    makeupProduct(value = 0) {
        let { unit, div } = this.findUnit([value], 'Wh', 1);
        return { value: Math.floor((value / div) * 10) / 10, unit };
    },
    getMappingName(value, mapping) {
        const tags = Object.keys(mapping);
        const tag = tags.find(t => t.trim().toLowerCase() === (value || '').trim().toLowerCase());
        if (tag) {
            return mapping[tag];
        }

        return value;
    },
    getDeviceTagName(value) {
        return this.getMappingName(value, constant.DEVICE_TAG_NAME);
    },
    getEventErrorName(value) {
        return this.getMappingName(value, constant.EVENT_ERROR_NAME);
    },
};