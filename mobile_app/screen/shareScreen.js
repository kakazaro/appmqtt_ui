import React from 'react';
import AppBarLayout from '../component/appBarLayout';
import { Dimensions, Image, ScrollView, Share, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { colors } from '../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// https://www.qrcode-monkey.com/#
const ShareScreen = () => {
    const imgWidth = Dimensions.get('window').width * 0.5;

    const onShareClick = () => {
        (async () => {
            try {
                await Share.share({
                    message: 'https://play.google.com/store/apps/details?id=com.ntvorg.ntvisolar'
                });
            } catch (e) {
                // ignore
            }
        })();
    };

    return <AppBarLayout title={'Chia sẻ ứng dụng'}>
        <ScrollView>
            <View style={{ margin: 15, padding: 20, borderColor: colors.PHILIPPINE_ORANGE, borderWidth: 2, borderRadius: 10, backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons name={'android'} size={24} color={colors.secondaryText}/>
                    <Image style={{ width: 155, height: 60 }} source={require('../assets/google-play-badge.png')}/>
                    <TouchableRipple onPress={onShareClick}>
                        <Image style={{ width: imgWidth, height: imgWidth }} source={require('../assets/android-qr-code.png')}/>
                    </TouchableRipple>
                    <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 10 }}>nhấn vào mã QR trên để gửi chia sẻ</Text>
                </View>
            </View>
            <View style={{ margin: 15, padding: 20, borderColor: colors.PHILIPPINE_ORANGE, borderWidth: 2, borderRadius: 10, backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons name={'apple'} size={24} color={colors.secondaryText}/>
                    <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 10 }}>Sẽ sớm có mặt ở Apple Store trong thời gian tới</Text>
                </View>
            </View>
        </ScrollView>
    </AppBarLayout>;
};

export default ShareScreen;
