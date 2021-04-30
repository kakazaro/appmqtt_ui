import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SiteScreen = () => {
    return <View style={styles.container}>
        <Text>Site!</Text>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default SiteScreen;
