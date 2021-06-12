import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import UserContext from '../context/userContext';
import LoginScreen from './loginScreen';
import HomeScreen from './homeScreen';
import SiteScreen from './siteScreen';
import DeviceScreen from './deviceScreen';
import HomeSettingScreen from './homeSetting/homeSettingScreen';
import AboutScreen from './homeSetting/aboutScreen';
import PolicyScreen from './homeSetting/policyScreen';
import SiteSettingScreen from './siteSetting/siteSettingScreen';
import ChartScreen from './chartScreen';
import UserScreen from './userSetting/userScreen';
import UserAddSiteScreen from './userSetting/userAddSiteScreen';
import ShareScreen from './shareScreen';
import RegisterScreen from './userSetting/registerScreen';
import AddSiteScreen from './addSiteScreen';
import EventScreen from './eventScreen';

const Stack = createStackNavigator();

const MainScreen = () => {
    const userContext = useContext(UserContext);

    const myTransition = {
        gestureDirection: 'horizontal',
        transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
        },
        headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    };

    return <>
        <StatusBar style='auto'/>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={!userContext.isLogin ? 'login' : 'home'} headerMode='none' screenOptions={{ ...myTransition }}>
                <Stack.Screen name={'login'} component={LoginScreen}/>

                <Stack.Screen name={'home'} component={HomeScreen}/>

                <Stack.Screen name={'setting'} component={HomeSettingScreen}/>
                <Stack.Screen name={'about'} component={AboutScreen}/>
                <Stack.Screen name={'policy'} component={PolicyScreen}/>

                <Stack.Screen name={'site'} component={SiteScreen}/>
                <Stack.Screen name={'siteSetting'} component={SiteSettingScreen}/>
                <Stack.Screen name={'addSite'} component={AddSiteScreen}/>

                <Stack.Screen name={'device'} component={DeviceScreen}/>

                <Stack.Screen name={'chart'} component={ChartScreen}/>

                <Stack.Screen name={'event'} component={EventScreen}/>


                <Stack.Screen name={'user'} component={UserScreen}/>
                <Stack.Screen name={'userAddSite'} component={UserAddSiteScreen}/>
                <Stack.Screen name={'register'} component={RegisterScreen}/>

                <Stack.Screen name={'share'} component={ShareScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    </>;
};

export default MainScreen;
