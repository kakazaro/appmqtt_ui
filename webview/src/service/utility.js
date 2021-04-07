export default {
    makeupMoney(value) {
        let even = Math.floor(value);
        const odd = value - even;

        even = even.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return even + '.' + Math.floor(odd * 100);
    }
};