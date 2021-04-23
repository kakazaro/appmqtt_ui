import axiosModule from 'axios';

const axios = axiosModule.create({
    baseURL: process.env.REACT_APP_ENV.trim() === 'prod' ? process.env.REACT_APP_BASE_URL_PROD : process.env.REACT_APP_BASE_URL_LOCAL,
    timeout: 30000,
    // withCredentials: true
});

export default axios;