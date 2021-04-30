import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserContext from '../context/userContext';
import LoginScreen from './loginScreen';
import HomeScreen from './homeScreen';
import SiteScreen from './siteScreen';
import DeviceScreen from './deviceScreen';
import mainAppBar from '../component/mainAppBar';
import RegisterScreen from './registerScreen';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Stack = createStackNavigator();

const MainScreen = () => {
    const userContext = useContext(UserContext);

    const GetOptionsHomeScreen = ({ route }) => {
        const name = getFocusedRouteNameFromRoute(route) ?? 'sites';
        const options = { showMenu: true };
        switch (name) {
            case 'alarms':
                options.title = 'Cảnh Báo';
                break;
            case 'users':
                options.title = 'Quản Lý Người Dùng';
                break;
            case 'sites':
            default:
                options.title = 'Trạm Điện';
                break;
        }

        return options;
    };

    return <View style={styles.container}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={!userContext.token ? 'login' : 'home'} headerMode='screen' screenOptions={{ header: mainAppBar }}>
                <Stack.Screen name={'login'} options={{ title: 'Đăng Nhập' }} component={LoginScreen}/>
                <Stack.Screen name={'register'} options={{ title: 'Đăng ký tài khoản' }} component={RegisterScreen}/>
                <Stack.Screen name={'home'} options={GetOptionsHomeScreen} component={HomeScreen}/>
                <Stack.Screen name={'site'} component={SiteScreen}/>
                <Stack.Screen name={'device'} component={DeviceScreen}/>
            </Stack.Navigator>
        </NavigationContainer>

        <StatusBar style='auto'/>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});

export default MainScreen;
