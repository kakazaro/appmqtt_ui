import React, { useContext } from 'react';
import { View } from 'react-native';
import AppBarLayout from '../../../component/appBarLayout';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ManualReportsTab from './reportsTabs/maunalReportsTab';
import AutoReportsTab from './reportsTabs/autoReportsTab';
import SiteContext from '../../../context/siteContext';

const Tab = createMaterialTopTabNavigator();

const SiteReportsScreen = () => {
    const siteContext = useContext(SiteContext);

    return <AppBarLayout title={'Báo cáo - ' + (siteContext?.site?.name || '')}>
        <View style={{ flex: 1 }}>
            <Tab.Navigator>
                <Tab.Screen name='manualReportsTab' options={{ title: 'Thủ công' }} component={ManualReportsTab}/>
                <Tab.Screen name='autoReportsTab' options={{ title: 'Tự động' }} component={AutoReportsTab}/>
            </Tab.Navigator>
        </View>
    </AppBarLayout>;
};

export default SiteReportsScreen;
