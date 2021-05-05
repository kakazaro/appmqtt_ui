import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import AppBarLayout from '../../component/appBarLayout';

const PolicyScreen = () => {
    return <AppBarLayout title={'Chính sách'}>
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: 'https://isolarcloud-32d36.web.app/policy.html' }}
            />
        </View>
    </AppBarLayout>;
};

export default PolicyScreen;
