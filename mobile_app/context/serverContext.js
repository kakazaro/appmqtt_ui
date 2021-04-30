import React, { createContext, useContext, useMemo } from 'react';
import UserContext from './userContext';
import axiosModule from 'axios';

// const REACT_APP_BASE_URL='http://113.161.79.146:5001'
const REACT_APP_BASE_URL = 'https://isolar-dummy.herokuapp.com';

const defaultValue = {
    axios: axiosModule.create({ baseURL: REACT_APP_BASE_URL }),
};
const ServerContext = createContext(defaultValue);

export const ServerProvider = ({ children }) => {
    const userContext = useContext(UserContext);

    const value = useMemo(() => {
        const axios = axiosModule.create({
            baseURL: REACT_APP_BASE_URL,
            timeout: 30000,
            headers: { 'Authorizer': userContext.token || '' }
        });

        return {
            ...defaultValue,
            axios
        };
    }, [userContext]);

    return <ServerContext.Provider value={value}>
        {children}
    </ServerContext.Provider>;
};

export default ServerContext;