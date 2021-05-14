import React, { useContext, useMemo, useState } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../common/themes';
import SitesTab from '../component/homeTabs/sitesTab';
import AlarmsTab from '../component/homeTabs/alarmsTab';
import UsersTab from '../component/homeTabs/usersTab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import AppBarLayout from '../component/appBarLayout';
import UserContext from '../context/userContext';
import utility from '../common/utility';
import InfoTab from '../component/homeTabs/InfoTab';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ route }) => {
    const userContext = useContext(UserContext);
    const [requestBack, setRequestBack] = useState(false);

    const appBarOptions = useMemo(() => {
        const name = getFocusedRouteNameFromRoute(route) ?? 'sites';
        const options = { showMainMenu: true };
        switch (name) {
            case 'alarms':
                options.title = 'Cảnh Báo';
                break;
            case 'users':
                options.title = 'Quản Lý Người Dùng';
                break;
            case 'info':
                options.title = 'Thông tin và Trợ giúp';
                break;
            case 'sites':
            default:
                options.title = 'N.T.V SOLAR';
                options.brand = true;
                break;
        }

        return options;
    }, [route]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (requestBack) {
                    return false;
                }

                Toast.show('Nhấn lần nữa để thoát', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0
                });
                setTimeout(() => setRequestBack(false), 5000);
                setRequestBack(true);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [requestBack])
    );

    return <AppBarLayout {...appBarOptions}>
        <Tab.Navigator backBehavior='none'>
            <Tab.Screen name='sites' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Trạm điện</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={SitesTab}/>
            <Tab.Screen name='alarms' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Cảnh báo lỗi</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'alert' : 'alert-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={AlarmsTab}/>
            {userContext?.user && userContext.user.role === utility.USER_ROLES.SA.id && <Tab.Screen name='users' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Quản lý</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={UsersTab}/>}
            {userContext?.user?.role !== utility.USER_ROLES.SA.id && <Tab.Screen name='info' options={{
                tabBarLabel: ({ focused }) => <Text style={[styles.tabTitle, (focused ? styles.tabTitleFocus : {})]}>Trợ giúp</Text>,
                tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name={focused ? 'help-circle' : 'help-circle-outline'} color={focused ? colors.PHILIPPINE_ORANGE : colors.DARK_SOULS} size={size}/>
            }} component={InfoTab}/>}
        </Tab.Navigator>
    </AppBarLayout>;
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
