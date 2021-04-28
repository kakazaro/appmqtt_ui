import React, { createContext, useEffect, useMemo, useState } from 'react';
import LoginPage from '../../page/login/loginPage';
import axios from '../../service/axios';

const defaultUser = { token: '' };
const TOKEN_KEY = '__token';
const UserContext = createContext(defaultUser);

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY) || '';
        setToken(token);
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    }, [token]);

    const value = useMemo(() => {
        axios.updateToken(token);

        return {
            ...defaultUser,
            token,
            logout: () => {
                localStorage.setItem(TOKEN_KEY, '');
                setToken('');
            }
        };
    }, [token]);

    const dom = useMemo(() => {
        if (value.token === undefined) {
            return null;
        }

        if (!value.token) {
            return <LoginPage onToken={(token) => setToken(token || '')}/>;
        }

        return children;
    }, [value, children]);

    return <UserContext.Provider value={value}>
        {dom}
    </UserContext.Provider>;
};

export default UserContext;