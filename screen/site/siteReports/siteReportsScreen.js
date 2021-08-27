import React, { useContext } from 'react';
import { View } from 'react-native';
import AppBarLayout from '../../../component/appBarLayout';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../../../common/themes';
import ManualReportsTab from './reportsTabs/maunalReportsTab';
import AutoReportsTab from './reportsTabs/autoReportsTab';
import SiteContext from '../../../context/siteContext';

const Tab = createMaterialTopTabNavigator();

const SiteReportsScreen = () => {
    const siteContext = useContext(SiteContext);

    return <AppBarLayout title={'Báo cáo - ' + (siteContext?.site?.name || '')}>
        <View style={{ flex: 1 }}>
            <Tab.Navigator tabBarOptions={{
                labelStyle: { fontSize: 15, textTransform: 'none' },
                tabStyle: { padding: 0 },
                activeTintColor: colors.PHILIPPINE_ORANGE,
                inactiveTintColor: colors.secondaryText,
                indicatorStyle: { backgroundColor: colors.PHILIPPINE_ORANGE, width: (100 / 2 - 5 * 2) + '%', marginStart: '5%' },
                style: { elevation: 0, borderBottomColor: colors.UNICORN_SILVER, borderBottomStyle: 'solid', borderBottomWidth: 1 }
            }}>
                <Tab.Screen name='manualReportsTab' options={{ title: 'Thủ công' }} component={ManualReportsTab}/>
                <Tab.Screen name='autoReportsTab' options={{ title: 'Tự động' }} component={AutoReportsTab}/>
            </Tab.Navigator>
        </View>
    </AppBarLayout>;
};

export default SiteReportsScreen;
