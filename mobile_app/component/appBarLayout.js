import React, { useContext, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Menu, Divider, IconButton } from 'react-native-paper';
import { colors } from '../common/themes';
import UserContext from '../context/userContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const AppBarLayout = ({ title, subtitle, children, showMainMenu, showSiteMenu, brand }) => {
    const userContext = useContext(UserContext);

    const navigation = useNavigation();
    const routeLength = useNavigationState(state => state?.routes?.length);

    let [fontsLoaded] = useFonts({
        'trivial-font': require('../assets/fonts/trivial-bold.otf')
    });
    const [visibleMenu, setVisibleMenu] = useState(false);

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

    return <View style={{ flex: 1 }}>
        <View>
            <Appbar.Header style={styles.bar}>
                {isCanBack && <Appbar.BackAction onPress={() => navigation.goBack()}/>}
                <Appbar.Content titleStyle={[styles.title, { color: brand ? colors.PHILIPPINE_ORANGE : colors.primaryText }, fontTitle]} title={title || ''} subtitle={subtitle || ''}/>
                {showMainMenu && <Menu
                    visible={visibleMenu}
                    onDismiss={() => setVisibleMenu(false)}
                    anchor={<IconButton icon={() => <MaterialCommunityIcons name='dots-vertical' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => setVisibleMenu(!visibleMenu)}/>}
                >
                    <Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='cog-outline' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => {
                        setVisibleMenu(false);
                        navigation.navigate('setting');
                    }} title='Cài đặt'/>
                    {/*<Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='information-outline' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => {*/}
                    {/*}} title='Thông tin'/>*/}
                    <Divider/>
                    <Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='power' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => {
                        setVisibleMenu(false);
                        userContext.logout(navigation);
                    }} title='Đăng xuất'/>
                </Menu>}
                {showSiteMenu && <IconButton icon={() => <MaterialCommunityIcons name='cog-outline' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => navigation.navigate('siteSetting')}/>}
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
