import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
// import UserContext from '../context/userContext';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SitesTab from '../component/homeTabs/sitesTab';
import AlarmsTab from '../component/homeTabs/alarmsTab';
import UsersTab from '../component/homeTabs/usersTab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';
import { Text } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
    // const userContext = useContext(UserContext);

    return (
        <Tab.Navigator>
            <Tab.Screen name='sites' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Trạm điện</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name='sitemap' color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={SitesTab}/>
            <Tab.Screen name='alarms' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Cảnh báo lỗi</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name='account-circle-outline' color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={AlarmsTab}/>
            <Tab.Screen name='users' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Quản lý</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name='account-circle-outline' color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={UsersTab}/>
        </Tab.Navigator>
    );

    // return <View style={styles.container}>
    //     <Text onPress={() => userContext.logout(navigation)}>Home!</Text>
    // </View>;
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
