import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import UserContext from '../context/userContext';
import LoginScreen from './loginScreen';
import HomeScreen from './homeScreen';
import SiteScreen from './site/siteScreen';
import DeviceScreen from './device/deviceScreen';
import HomeSettingScreen from './homeSetting/homeSettingScreen';
import AboutScreen from './homeSetting/aboutScreen';
import PolicyScreen from './homeSetting/policyScreen';
import SiteSettingScreen from './site/siteSettingScreen';
import ChartScreen from './chartScreen';
import UserScreen from './user/userScreen';
import UserAddSiteScreen from './user/userAddSiteScreen';
import ShareScreen from './info/shareScreen';
import RegisterScreen from './user/registerScreen';
import AddSiteScreen from './site/addSiteScreen';
import SiteReportsScreen from './site/siteReports/siteReportsScreen';
import EventScreen from './event/eventScreen';
import SelectIotScreen from './site/selectIotScreen';
import AddDeviceScreen from './site/addDeviceScreen';
import IotScreen from './iot/iotScreen';
import { SafeAreaView, StatusBar } from 'react-native';

const Stack = createStackNavigator();

const MainScreen = () => {
    const userContext = useContext(UserContext);

    return <SafeAreaView style={{ flex: 1 }}>
        <StatusBar/>
        {!userContext.isLogin && <LoginScreen/>}
        {userContext.isLogin && <NavigationContainer>
            <Stack.Navigator initialRouteName={'home'} screenOptions={{
                transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec,
                },
                gestureDirection: 'horizontal',
                headerStyleInterpolator: HeaderStyleInterpolators.forFade,
                headerShown: false
            }}>
                <Stack.Screen name={'home'} component={HomeScreen}/>

                <Stack.Screen name={'setting'} component={HomeSettingScreen}/>
                <Stack.Screen name={'about'} component={AboutScreen}/>
                <Stack.Screen name={'policy'} component={PolicyScreen}/>

                <Stack.Screen name={'site'} component={SiteScreen}/>
                <Stack.Screen name={'siteSetting'} component={SiteSettingScreen}/>
                <Stack.Screen name={'addSite'} component={AddSiteScreen}/>
                <Stack.Screen name={'selectIot'} component={SelectIotScreen}/>
                <Stack.Screen name={'addDevice'} component={AddDeviceScreen}/>
                <Stack.Screen name={'siteReports'} component={SiteReportsScreen}/>

                <Stack.Screen name={'device'} component={DeviceScreen}/>
                <Stack.Screen name={'iot'} component={IotScreen}/>

                <Stack.Screen name={'chart'} component={ChartScreen}/>

                <Stack.Screen name={'event'} component={EventScreen}/>

                <Stack.Screen name={'user'} component={UserScreen}/>
                <Stack.Screen name={'userAddSite'} component={UserAddSiteScreen}/>
                <Stack.Screen name={'register'} component={RegisterScreen}/>

                <Stack.Screen name={'share'} component={ShareScreen}/>
            </Stack.Navigator>
        </NavigationContainer>}
    </SafeAreaView>;
};

export default MainScreen;
