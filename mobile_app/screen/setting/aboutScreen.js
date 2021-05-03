import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import Constants from 'expo-constants';
import { colors } from '../../common/themes';
import { Text } from 'react-native-paper';
import FlatNavButton from '../../component/flatNavButton';

const AboutScreen = ({ navigation }) => {

    return <ScrollView style={{ backgroundColor: 'white' }}>
        <View>
            <View style={{ margin: 15, height: 110, backgroundColor: colors.SUNBURST_LIGHT, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                <Image source={require('../../assets/favicon.png')} style={{ borderRadius: 5 }}/>
                <Text style={{ color: colors.PHILIPPINE_ORANGE, marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>NTV Solar</Text>
            </View>
            <View style={{ padding: 15 }}>
                <Text style={{ color: colors.primaryText, fontSize: 16, fontWeight: 'bold' }}>Phiên bản ứng dụng:</Text>
                <Text style={{ color: colors.secondaryText, marginTop: 5, fontSize: 14 }}>{`V${Constants.nativeAppVersion} (build: ${Constants.nativeBuildVersion})`}</Text>
            </View>
            <FlatNavButton
                title={'Chính sách sử dụng'}
                style={{ borderTopStyle: 'solid', borderTopWidth: 1, borderTopColor: colors.UNICORN_SILVER, borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: colors.UNICORN_SILVER }}
                onPress={() => navigation.navigate('policy')}
            />
        </View>
    </ScrollView>;
};

export default AboutScreen;
