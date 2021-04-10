export default {
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

        return (even + '' + unit).trim();
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
        let unit = 'KWh';
        let div = 1;

        if (!values?.length) {
            return { unit, div };
        }

        const value = values.reduce((max, cur) => cur > max ? cur : max, 0);

        if (value > 1000 * 1000) {
            unit = 'GWh';
            div = 1000 * 1000;
        } else if (value > 1000) {
            unit = 'MWh';
            div = 1000;
        } else if (value > 0) {
            unit = 'KWh';
            div = 1;
        } else {
            unit = 'Wh';
            div = 1 / 1000;
        }

        return { unit, div };
    }

};