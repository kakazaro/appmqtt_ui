import axiosModule from 'axios';

const axios = axiosModule.create({
    baseURL: process.env.REACT_APP_ENV.trim() === 'prod' ? process.env.REACT_APP_BASE_URL_PROD : process.env.REACT_APP_BASE_URL_LOCAL,
    // baseURL: 'http://113.161.79.146:5001',
    // baseURL: 'http://localhost:3001',
    timeout: 30000,
    // withCredentials: true
});

class axiosClass {
    updateToken(token) {
        this.token = token;
    }

    getRequestOption(options) {
        const requestOptions = {
            ...options
        };

        if (this.token) {
            requestOptions.headers = {
                ...(requestOptions?.headers || {}),
                Authorization: 'Bearer ' + this.token
            };
        }

        return requestOptions;
    }

    get(url, options = {}) {
        return axios.get(url, this.getRequestOption(options));
    }

    post(url, data, options = {}) {
        return axios.post(url, data, this.getRequestOption(options));
    }
}

export default new axiosClass();