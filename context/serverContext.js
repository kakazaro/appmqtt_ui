import React, { createContext, useContext, useMemo } from 'react';
import UserContext from './userContext';
import axiosModule from 'axios';
import 'react-native-get-random-values';
import { v4 as uidv4 } from 'uuid';
import constant from '../common/constant';
import serverError, { errors } from '../common/serverError';

const REACT_APP_BASE_URL = constant.REACT_APP_BASE_URL;

function DataControl(axios, logout) {
    const start = {};

    const loopGetSiteData = (url, handler, handlerError, query, uid, duration = 5000) => {
        (async () => {
            if (start[uid]) {
                try {
                    if (query) {
                        Object.keys(query).forEach(key => {
                            url += (url.includes('?') ? '&' : '?') + `${key}=${encodeURIComponent(query[key])}`;
                        });
                    }
                    const response = await axios.get(url);
                    if (start[uid]) {
                        if (handlerError) {
                            handlerError(undefined);
                        }
                        handler(response.data);
                    }
                } catch (err) {
                    // console.log(err);
                    if (err?.response?.data?.code === errors.E40019.code && logout) {
                        logout(true);
                    } else if (handlerError) {
                        handlerError(serverError.getError(err));
                    }
                }
            }

            if (!start[uid]) {
                start[uid] = 0;
            } else {
                start[uid] = setTimeout(() => {
                    loopGetSiteData(url, handler, handlerError, query, uid, duration);
                }, duration);
            }
        })();
    };

    return {
        registerSiteData({ url, handler, query, duration, handlerError }) {
            const uid = uidv4();
            start[uid] = true;
            loopGetSiteData(url, handler, handlerError, query, uid, duration);
            return uid;
        },

        unRegisterSiteData(uid) {
            clearTimeout(typeof start[uid] === 'number' ? start[uid] : 0);
            start[uid] = false;
        }
    };
}

const DEFAULT_AXIOS = axiosModule.create({ baseURL: '' });

const defaultValue = {
    get: (url, config) => DEFAULT_AXIOS.get(url, config),
    post: (url, data, config) => DEFAULT_AXIOS.post(url, data, config),
    delete: (url, config) => DEFAULT_AXIOS.delete(url, config),
    dataControl: new DataControl(undefined)
};
const ServerContext = createContext(defaultValue);

export const ServerProvider = ({ children }) => {
    const userContext = useContext(UserContext);

    const value = useMemo(() => {
        const axios = axiosModule.create({
            baseURL: REACT_APP_BASE_URL,
            timeout: 30000,
            headers: { 'Authorization': 'Bearer ' + (userContext.token || '') }
        });

        return {
            ...defaultValue,
            get: async (url, config) => {
                try {
                    return await axios.get(url, config);
                } catch (e) {
                    // console.log(e?.response);
                    if (e?.response?.data?.code === errors.E40019.code) {
                        userContext.logout(true);
                    }
                    throw e;
                }
            },
            post: (url, data, config) => axios.post(url, data, config),
            delete: (url, config) => axios.delete(url, config),
            dataControl: new DataControl(axios, userContext.logout)
        };
    }, [userContext]);

    return <ServerContext.Provider value={value}>
        {children}
    </ServerContext.Provider>;
};

export default ServerContext;