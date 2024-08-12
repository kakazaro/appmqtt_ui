import React from 'react';
import AppBarLayout from '../../component/appBarLayout';
import { Dimensions, Image, Linking, ScrollView, Share, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const shares = [
    {
        icon: 'android',
        qrCode: require('../../assets/android-qr-code.png'),
        badge: require('../../assets/google-play-badge.png'),
        badgeStyle: { width: 155, height: 60 },
        url: 'https://play.google.com/store/apps/details?id=com.ntv.isolar'
    },
    {
        icon: 'apple',
        qrCode: require('../../assets/ios-qr-code.png'),
        badge: require('../../assets/app_store_badge.png'),
        badgeStyle: { width: 120, height: 40, marginTop: 10, marginBottom: 10 },
        url: 'https://apps.apple.com/vn/app/ntv-solar/id1566321133'
    }
];

// https://www.qrcode-monkey.com/#
const ShareScreen = () => {
    const imgWidth = Dimensions.get('window').width * 0.5;

    const onShareClick = (url) => {
        (async () => {
            try {
                await Share.share({
                    message: url
                });
            } catch (e) {
                // ignore
            }
        })();
    };

    return <AppBarLayout title={'Chia sẻ ứng dụng'}>
        <ScrollView>
            {shares.map((share, index) => <View key={index} style={{ margin: 15, padding: 20, borderColor: colors.PHILIPPINE_ORANGE, borderWidth: 2, borderRadius: 10, backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons name={share.icon} size={24} color={colors.secondaryText}/>
                    <TouchableOpacity onPress={() => Linking.openURL(share.url)}>
                        <Image style={share.badgeStyle} source={share.badge}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onShareClick(share.url)}>
                        <Image style={{ width: imgWidth, height: imgWidth }} source={share.qrCode}/>
                    </TouchableOpacity>
                    <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 10 }}>nhấn vào mã QR trên để chia sẻ ứng dụng</Text>
                </View>
            </View>)}

        </ScrollView>
    </AppBarLayout>;
};

export default ShareScreen;
