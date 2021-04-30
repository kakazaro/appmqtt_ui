import React, { createContext, useEffect, useMemo, useState } from 'react';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultUser = {
    token: '',
    updateToken: () => undefined,
    logout: () => undefined,
};
const TOKEN_KEY = '__token';
const UserContext = createContext(defaultUser);

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState();

    useEffect(() => {
        (async () => {
            setToken((await AsyncStorage.getItem(TOKEN_KEY)) || '');
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await AsyncStorage.setItem(TOKEN_KEY, token || '');
        })();
    }, [token]);

    const value = useMemo(() => {
        return {
            ...defaultUser,
            token,
            updateToken: (token, navigation) => {
                setToken(token);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'home' }],
                });
            },
            logout: (navigation) => {
                setToken('');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                });
            }
        };
    }, [token]);

    const dom = useMemo(() => {
        if (value.token === undefined) {
            return <AppLoading/>;
        }

        return children;
    }, [value, children]);

    return <UserContext.Provider value={value}>
        {dom}
    </UserContext.Provider>;
};

export default UserContext;