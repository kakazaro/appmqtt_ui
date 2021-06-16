import React from 'react';
import { StyleSheet, View } from 'react-native';
import EventsList from '../../component/eventsList';

const EventsTab = () => {
    return <View style={styles.container}>
        <EventsList/>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
});

export default EventsTab;
