import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu, Divider, IconButton } from 'react-native-paper';
import { colors } from '../common/themes';
import UserContext from '../context/userContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MainAppBar = ({ scene, previous, navigation }) => {
    const userContext = useContext(UserContext);

    const isCanBack = !!previous;

    const { options } = scene.descriptor;
    const [visibleMenu, setVisibleMenu] = useState(false);

    const title =
        options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : scene.route.name;

    const showMenu = !!options?.showMenu;
    return <Appbar.Header style={styles.bar}>
        {isCanBack && <Appbar.BackAction onPress={() => navigation.goBack()}/>}
        <Appbar.Content titleStyle={[styles.title, { color: options.brand ? colors.PHILIPPINE_ORANGE : colors.primaryText }]} title={title}/>
        {showMenu && <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={<IconButton icon={() => <MaterialCommunityIcons name='dots-vertical' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => setVisibleMenu(!visibleMenu)}/>}
        >
            <Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='cog-outline' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => {
            }} title='Cài đặt'/>
            <Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='information-outline' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => {
            }} title='Thông tin'/>
            <Divider/>
            <Menu.Item titleStyle={styles.menuTitle} icon={() => <MaterialCommunityIcons name='power' size={24} color={colors.PHILIPPINE_ORANGE}/>} onPress={() => userContext.logout(navigation)} title='Đăng xuất'/>
        </Menu>}
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
        fontWeight: 'bold',
        color: colors.primaryText
    },
    menuTitle: {
        fontSize: 14,
        margin: 0,
        color: colors.PHILIPPINE_ORANGE
    }
});

export default MainAppBar;
