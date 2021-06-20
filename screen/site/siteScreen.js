import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, IconButton, Menu } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SiteOverviewTab from './siteTabs/siteOverviewTab';
import SiteDevicesTab from './siteTabs/siteDevicesTab';
import SiteAlarmsTab from './siteTabs/siteAlarmsTab';
import { colors } from '../../common/themes';
import SiteContext from '../../context/siteContext';
import AppBarLayout from '../../component/appBarLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UserContext from '../../context/userContext';

const Tab = createMaterialTopTabNavigator();

const SiteScreen = ({ navigation, route }) => {
    const userContext = useContext(UserContext);
    const siteContext = useContext(SiteContext);
    const siteRoute = useMemo(() => route?.params?.site, [route]);

    useEffect(() => {
        siteContext.updateSite(siteRoute);

        return () => {
            siteContext.updateSite(undefined);
        };
    }, [siteRoute]);

    const site = useMemo(() => siteContext?.site, [siteContext]);

    const [visibleAddMenu, setVisibleAddMenu] = useState(false);

    const menu = useMemo(() => {
        return <>
            {userContext.rolePermission.addDevice && <Menu
                visible={visibleAddMenu}
                onDismiss={() => setVisibleAddMenu(false)}
                style={{ marginTop: 40 }}
                anchor={<IconButton icon={() => <MaterialCommunityIcons name='plus' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => setVisibleAddMenu(!visibleAddMenu)}/>}
            >
                <Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='plus-network' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => {
                    setVisibleAddMenu(false);
                    navigation.navigate('selectIot', { site: siteRoute });
                }} title='Thêm Inverter'/>
            </Menu>}

            {userContext.rolePermission.accessSiteSetting && <IconButton icon={() => <MaterialCommunityIcons name='cog-outline' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => navigation.navigate('siteSetting')}/>}
        </>;
    }, [userContext, visibleAddMenu, siteRoute]);

    return <AppBarLayout menu={menu}>
        <View style={styles.container}>
            <View style={{ backgroundColor: 'white', width: '100%' }}>
                <Headline style={{ margin: 0, paddingStart: 15, paddingEnd: 15 }}>{site?.name}</Headline>
            </View>
            <View style={{ flex: 1, width: '100%' }}>
                <Tab.Navigator tabBarOptions={{
                    labelStyle: { fontSize: 15, textTransform: 'none' },
                    tabStyle: { padding: 0 },
                    activeTintColor: colors.PHILIPPINE_ORANGE,
                    inactiveTintColor: colors.secondaryText,
                    indicatorStyle: { backgroundColor: colors.PHILIPPINE_ORANGE, width: (100 / 3 - 5 * 3) + '%', marginStart: '5%' },
                    style: { elevation: 0, borderBottomColor: colors.UNICORN_SILVER, borderBottomStyle: 'solid', borderBottomWidth: 1 }
                }}>
                    <Tab.Screen name='siteOverview' options={{ title: 'Thông tin chung' }} component={SiteOverviewTab}/>
                    <Tab.Screen name='siteDevices' options={{ title: 'Thiết bị' }} component={SiteDevicesTab}/>
                    <Tab.Screen name='siteAlarms' options={{ title: 'Sự cố' }} component={SiteAlarmsTab}/>
                </Tab.Navigator>
            </View>
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


export default SiteScreen;
