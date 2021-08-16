import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { colors } from '../common/themes';
import { useFonts } from 'expo-font';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const AppBarLayout = ({ title, subtitle, children, menu, brand }) => {
    const navigation = useNavigation();
    const routeLength = useNavigationState(state => state?.routes?.length);

    let [fontsLoaded] = useFonts({
        'trivial-font': require('../assets/fonts/trivial-bold.otf')
    });

    const isCanBack = useMemo(() => routeLength > 1, [routeLength]);

    const fontTitle = useMemo(() => {
        if (fontsLoaded && brand) {
            return {
                fontWeight: 'normal',
                fontFamily: 'trivial-font'
            };
        }

        return {};
    }, [fontsLoaded, brand]);

    const appBarContent = useMemo(() => {
        if (!brand) {
            return <Appbar.Content titleStyle={[styles.title, { color: colors.primaryText }, fontTitle]} title={title || ''} subtitle={subtitle || ''}/>;
        }

        return <View style={{ flex: 1, paddingStart: 10 }}>
            <Image style={{ width: 90, height: 40, resizeMode: 'contain' }} source={require('../assets/Logo_NTV_home.png')}/>
        </View>;
    }, [brand, fontTitle, title, subtitle]);

    return <View style={{ flex: 1 }}>
        <View>
            <Appbar.Header style={styles.bar}>
                {isCanBack && <Appbar.BackAction onPress={() => navigation.goBack()}/>}
                {appBarContent}
                {menu}
            </Appbar.Header>
        </View>
        <View style={{ flex: 1 }}>
            {children}
        </View>
    </View>;
};

const styles = StyleSheet.create({
    bar: {
        backgroundColor: 'white',
        elevation: 0,
        width: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'normal',
        color: colors.primaryText
    },
    menuTitle: {
        fontSize: 14,
        margin: 0,
        color: colors.PHILIPPINE_ORANGE
    }
});

export default AppBarLayout;
