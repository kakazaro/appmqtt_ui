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
            <View style={{ flexDirection: 'row', backgroundColor: 'white', width: '100%', paddingStart: 15, paddingEnd: 15, paddingBottom: 5, alignItems: 'center' }}>
                <Headline style={{ flex: 1, margin: 0, color: colors.PHILIPPINE_ORANGE }}>{site?.name}</Headline>
            </View>
            <View style={{ flex: 1, width: '100%' }}>
                <Tab.Navigator>
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
