import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import UserContext from '../context/userContext';
import LoginScreen from './loginScreen';
import HomeScreen from './homeScreen';
import SiteScreen from './siteScreen';
import DeviceScreen from './deviceScreen';
import RegisterScreen from './registerScreen';
import HomeSettingScreen from './homeSetting/homeSettingScreen';
import AboutScreen from './homeSetting/aboutScreen';
import PolicyScreen from './homeSetting/policyScreen';
import SiteSettingScreen from './siteSetting/siteSettingScreen';
import ChartScreen from './chartScreen';

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

    return <SafeAreaView style={styles.container}>
        <StatusBar style='auto'/>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={!userContext.token ? 'login' : 'home'} headerMode='none' screenOptions={{ ...myTransition }}>
                <Stack.Screen name={'login'} component={LoginScreen}/>
                <Stack.Screen name={'register'} component={RegisterScreen}/>

                <Stack.Screen name={'home'} component={HomeScreen}/>

                <Stack.Screen name={'setting'} component={HomeSettingScreen}/>
                <Stack.Screen name={'about'} component={AboutScreen}/>
                <Stack.Screen name={'policy'} component={PolicyScreen}/>

                <Stack.Screen name={'site'} component={SiteScreen}/>
                <Stack.Screen name={'siteSetting'} component={SiteSettingScreen}/>

                <Stack.Screen name={'device'} component={DeviceScreen}/>

                <Stack.Screen name={'chart'} component={ChartScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaView>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});

export default MainScreen;
