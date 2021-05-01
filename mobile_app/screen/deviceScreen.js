import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DeviceScreen = ({ route }) => {

    return <View style={styles.container}>
        <Text>Device!</Text>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default DeviceScreen;
