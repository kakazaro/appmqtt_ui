import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UsersTab = () => {
    return <View style={styles.container}>
        <Text>UsersTab!</Text>
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
