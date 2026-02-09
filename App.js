import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Provider } from 'react-native-paper';
import MainScreen from './screen/mainScreen';
import UpdateWrap from './component/updateWrap';
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
                        <SafeAreaView style={styles.container}>
                            <UpdateWrap>
                                <MainScreen/>
                            </UpdateWrap>
                        </SafeAreaView>
                    </RootSiblingParent>
                </Provider>
            </SiteProvider>
        </ServerProvider>
    </UserProvider>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});
