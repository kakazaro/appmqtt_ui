import React, { createContext, useEffect, useMemo, useState } from 'react';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import constant from '../common/constant';

const defaultUser = {
    id: '',
    user: {},
    isLogin: false,
    token: '',
    isOutSession: false,
    login: () => undefined,
    logout: () => undefined,
    resetOutSession: () => undefined
};
const LOGIN_DATA_KEY = '__login';
const UserContext = createContext(defaultUser);

export const UserProvider = ({ children }) => {
    const [loginData, setLoginData] = useState();
    const [isOutSession, setIsOutSession] = useState(false);

    const [loading, setLoading] = useState(true);

    const verifyLoginData = (data) => {
        return data?.token && data?.user?._id && data?.user?.name && data?.user?.email && data?.user?.role;
    };

    const login = async (data) => {
        if (verifyLoginData(data)) {
            await AsyncStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(data));
            setLoginData(data);
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        (async () => {
            const dataString = (await AsyncStorage.getItem(LOGIN_DATA_KEY)) || '{}';
            let data;
            try {
                data = JSON.parse(dataString);
            } catch (e) {
                // Ignore
            }

            if (verifyLoginData(data)) {
                try {
                    const response = await axios.get(`${constant.REACT_APP_BASE_URL}/users/me`, {
                        timeout: 5000,
                        headers: { 'Authorization': 'Bearer ' + data.token }
                    });
                    data.user = {
                        _id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.role
                    };

                    if (verifyLoginData(data)) {
                        setLoginData(data);
                    }
                } catch (e) {
                    // Ignore, use last data
                    setLoginData(data);
                }
            }

            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!loading) {
            (async () => {
                await AsyncStorage.setItem(LOGIN_DATA_KEY, loginData ? JSON.stringify(loginData) : '');
            })();
        }
    }, [loading, loginData]);

    const value = useMemo(() => {
        return {
            ...defaultUser,
            user: loginData?.user || {},
            id: loginData?.user?._id,
            isLogin: !!loginData,
            token: loginData?.token,
            isOutSession,
            login,
            logout: (isOutSession) => {
                setIsOutSession(!!isOutSession);
                setLoginData(undefined);
            },
            resetOutSession: () => setIsOutSession(false)
        };
    }, [loginData, isOutSession]);

    const dom = useMemo(() => {
        if (loading) {
            return <AppLoading/>;
        }

        return children;
    }, [loading, children]);

    return <UserContext.Provider value={value}>
        {dom}
    </UserContext.Provider>;
};

export default UserContext;