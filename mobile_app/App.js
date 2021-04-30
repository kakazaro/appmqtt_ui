import React from 'react';
import { Provider } from 'react-native-paper';
import MainScreen from './screen/mainScreen';
import { UserProvider } from './context/userContext';
import { ServerProvider } from './context/serverContext';

export default function App() {
    return <UserProvider>
        <ServerProvider>
            <Provider>
                <MainScreen/>
            </Provider>
        </ServerProvider>
    </UserProvider>;
}

