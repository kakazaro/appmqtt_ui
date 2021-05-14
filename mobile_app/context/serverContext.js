import React, { createContext, useContext, useMemo } from 'react';
import UserContext from './userContext';
import axiosModule from 'axios';
import 'react-native-get-random-values';
import { v4 as uidv4 } from 'uuid';
import constant from '../common/constant';

const REACT_APP_BASE_URL = constant.REACT_APP_BASE_URL;

function DataControl(axios) {
    const start = {};

    const loopGetSiteData = (url, handler, query, uid, duration = 5000) => {
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
                        handler(response.data);
                    }
                } catch (err) {
                    // console.log(err);
                }
            }

            if (!start[uid]) {
                start[uid] = 0;
            } else {
                start[uid] = setTimeout(() => {
                    loopGetSiteData(url, handler, query, uid, duration);
                }, duration);
            }
        })();
    };

    return {
        registerSiteData({ url, handler, query, duration }) {
            const uid = uidv4();
            start[uid] = true;
            loopGetSiteData(url, handler, query, uid, duration);
            return uid;
        },

        unRegisterSiteData(uid) {
            clearTimeout(typeof start[uid] === 'number' ? start[uid] : 0);
            start[uid] = false;
        }
    };
}

const defaultValue = {
    axios: axiosModule.create({ baseURL: '' }),
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
            axios,
            dataControl: new DataControl(axios)
        };
    }, [userContext]);

    return <ServerContext.Provider value={value}>
        {children}
    </ServerContext.Provider>;
};

export default ServerContext;