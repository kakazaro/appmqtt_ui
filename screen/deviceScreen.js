import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppBarLayout from '../component/appBarLayout';
import { Headline } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../common/themes';
import DeviceOverviewTab from '../component/deviceTabs/deviceOverviewTab';
import DeviceAlarmsTab from '../component/deviceTabs/deviceAlarmsTab';
import DeviceChartTab from '../component/deviceTabs/deviceChartTab';
import SiteContext from '../context/siteContext';

const Tab = createMaterialTopTabNavigator();

const DeviceScreen = ({ route }) => {
    const siteContext = useContext(SiteContext);
    const deviceRoute = useMemo(() => route?.params?.device, [route]);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        siteContext.updateDevice(deviceRoute);
        setIsDone(true);
    }, [deviceRoute]);

    return <AppBarLayout>
        <View style={styles.container}>
            <View style={{ backgroundColor: 'white', width: '100%' }}>
                <Headline style={{ margin: 0, paddingStart: 15, paddingEnd: 15 }}>{deviceRoute?.name}</Headline>
            </View>
            {isDone && <View style={{ flex: 1, width: '100%' }}>
                <Tab.Navigator tabBarOptions={{
                    labelStyle: { fontSize: 14, textTransform: 'none' },
                    tabStyle: { padding: 0 },
                    activeTintColor: colors.PHILIPPINE_ORANGE,
                    inactiveTintColor: colors.secondaryText,
                    indicatorStyle: { backgroundColor: colors.PHILIPPINE_ORANGE, width: (100 / 3 - 5 * 3) + '%', marginStart: '5%' },
                    style: { elevation: 0, borderBottomColor: colors.UNICORN_SILVER, borderBottomStyle: 'solid', borderBottomWidth: 1 }
                }}>
                    <Tab.Screen name='deviceOverview' options={{ title: 'Thông tin cơ bản' }} component={DeviceOverviewTab}/>
                    <Tab.Screen name='deviceAlarms' options={{ title: 'Sự cố' }} component={DeviceAlarmsTab}/>
                    <Tab.Screen name='deviceChart' options={{ title: 'Thông tin phát điện' }} component={DeviceChartTab}/>
                </Tab.Navigator>
            </View>}
        </View>
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%'
    },
});


export default DeviceScreen;
