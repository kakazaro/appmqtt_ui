import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SiteOverviewTab from '../component/siteTabs/siteOverviewTab';
import SiteDevicesTab from '../component/siteTabs/siteDevicesTab';
import SiteAlarmsTab from '../component/siteTabs/siteAlarmsTab';
import { colors } from '../common/themes';

const Tab = createMaterialTopTabNavigator();

export const SiteContext = React.createContext({ site: undefined });

const SiteScreen = ({ route }) => {
    const site = useMemo(() => route?.params?.site, [route]);

    return <View style={styles.container}>
        <View style={{ backgroundColor: 'white', width: '100%' }}>
            <Headline style={{ margin: 0, paddingStart: 15, paddingEnd: 15 }}>{site?.name}</Headline>
        </View>
        <View style={{ flex: 1, width: '100%' }}>
            <SiteContext.Provider value={{ site }}>
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
            </SiteContext.Provider>
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
