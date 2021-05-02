import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../common/themes';

import SitesTab from '../component/homeTabs/sitesTab';
import AlarmsTab from '../component/homeTabs/alarmsTab';
import UsersTab from '../component/homeTabs/usersTab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {

    return (
        <Tab.Navigator>
            <Tab.Screen name='sites' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Trạm điện</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={SitesTab}/>
            <Tab.Screen name='alarms' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Cảnh báo lỗi</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'alert' : 'alert-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={AlarmsTab}/>
            <Tab.Screen name='users' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Quản lý</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={UsersTab}/>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabTitle: {
        fontSize: 13,
        color: colors.DARK_SOULS
    },
    tabTitleFocus: {
        color: colors.PHILIPPINE_ORANGE
    },
});


export default HomeScreen;
