import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../common/themes';

const UsersTab = () => {
    return <View style={styles.container}>
        <Text style={{ color: colors.DARK_SOULS }}>Chưa có dữ liệu</Text>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default UsersTab;
