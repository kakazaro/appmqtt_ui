import React, { useContext, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu, Divider, IconButton } from 'react-native-paper';
import { colors } from '../common/themes';
import UserContext from '../context/userContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const MainAppBar = ({ scene, previous, navigation }) => {
    let [fontsLoaded] = useFonts({
        'trivial-font': require('../assets/fonts/trivial-bold.otf')
    });
    const [visibleMenu, setVisibleMenu] = useState(false);

    const userContext = useContext(UserContext);

    const isCanBack = useMemo(() => !!previous, [previous]);
    const { options } = useMemo(() => scene.descriptor, [scene]);
    const title = useMemo(() => {
        return options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
                ? options.title
                : scene.route.name;
    }, [options]);

    const showMenu = useMemo(() => !!options?.showMenu, [options]);
    const showSiteMenu = useMemo(() => !!options?.showSiteMenu, [options]);

    const fontTitle = useMemo(() => {
        if (fontsLoaded && options.brand) {
            return {
                fontWeight: 'normal',
                fontFamily: 'trivial-font'
            };
        }

        return {};
    }, [fontsLoaded, options]);

    return <Appbar.Header style={styles.bar}>
        {isCanBack && <Appbar.BackAction onPress={() => navigation.goBack()}/>}
        <Appbar.Content titleStyle={[styles.title, { color: options.brand ? colors.PHILIPPINE_ORANGE : colors.primaryText }, fontTitle]} title={title}/>
        {showMenu && <Menu
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
    </Appbar.Header>;
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

export default MainAppBar;
