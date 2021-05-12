import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../listScroll';
import UserBadge from '../listBadge/userBadge';

const UsersTab = () => {
    return <View style={styles.container}>
        <ListScroll Component={UserBadge} showPlaceholder={true} path={'users'} url={'/users/list'}/>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
});

export default UsersTab;
