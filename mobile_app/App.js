import React from 'react';
import { Provider } from 'react-native-paper';
import MainScreen from './screen/mainScreen';
import { UserProvider } from './context/userContext';
import { ServerProvider } from './context/serverContext';
import { SiteProvider } from './context/siteContext';
import { RootSiblingParent } from 'react-native-root-siblings';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

export default function App() {
    return <UserProvider>
        <ServerProvider>
            <SiteProvider>
                <Provider>
                    <RootSiblingParent>
                        <MainScreen/>
                    </RootSiblingParent>
                </Provider>
            </SiteProvider>
        </ServerProvider>
    </UserProvider>;
}

