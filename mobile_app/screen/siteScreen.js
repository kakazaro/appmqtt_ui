import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SiteOverviewTab from '../component/siteTabs/siteOverviewTab';
import SiteDevicesTab from '../component/siteTabs/siteDevicesTab';
import SiteAlarmsTab from '../component/siteTabs/siteAlarmsTab';
import { colors } from '../common/themes';
import SiteContext from '../context/siteContext';

const Tab = createMaterialTopTabNavigator();

const SiteScreen = ({ route }) => {
    const siteContext = useContext(SiteContext);
    const siteRoute = useMemo(() => route?.params?.site, [route]);

    useEffect(() => {
        siteContext.updateSite(siteRoute);

        return () => {
            siteContext.updateSite(undefined);
        };
    }, [siteRoute]);

    const site = useMemo(() => siteContext?.site, [siteContext]);

    return <View style={styles.container}>
        <View style={{ backgroundColor: 'white', width: '100%' }}>
            <Headline style={{ margin: 0, paddingStart: 15, paddingEnd: 15 }}>{site?.name}</Headline>
        </View>
        <View style={{ flex: 1, width: '100%' }}>
            <Tab.Navigator tabBarOptions={{
                labelStyle: { fontSize: 14, textTransform: 'none' },
                tabStyle: { padding: 0 },
                activeTintColor: colors.PHILIPPINE_ORANGE,
                inactiveTintColor: colors.secondaryText,
                indicatorStyle: { backgroundColor: colors.PHILIPPINE_ORANGE, width: (100 / 3 - 10) + '%', marginStart: '5%' },
                style: { elevation: 0, borderBottomColor: colors.UNICORN_SILVER, borderBottomStyle: 'solid', borderBottomWidth: 1 }
            }}>
                <Tab.Screen name='siteOverview' options={{ title: 'Thông tin chung' }} component={SiteOverviewTab}/>
                <Tab.Screen name='siteDevices' options={{ title: 'Thiết bị' }} component={SiteDevicesTab}/>
                <Tab.Screen name='siteAlarms' options={{ title: 'Sự cố' }} component={SiteAlarmsTab}/>
            </Tab.Navigator>
        </View>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%'
    },
});


export default SiteScreen;
