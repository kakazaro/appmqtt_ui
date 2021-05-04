import React from 'react';
import { ScrollView, View } from 'react-native';
import { colors } from '../../common/themes';
import { Text } from 'react-native-paper';
import AppBarLayout from '../../component/appBarLayout';

const PolicyScreen = () => {

    return <AppBarLayout title={'Chính sách'}>
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.primaryText, fontSize: 16 }}>Coming soon</Text>
            </View>
        </ScrollView>
    </AppBarLayout>;
};

export default PolicyScreen;
