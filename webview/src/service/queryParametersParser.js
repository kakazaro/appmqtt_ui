export default {
    parse: (queryString) => {
        const query = {};
        const pairs = queryString ? (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&') : [];
        pairs.forEach((pair) => {
            const split = pair.split('=');
            query[decodeURIComponent(split[0])] = decodeURIComponent(split[1] || '');
        });
        return query;
    }
};