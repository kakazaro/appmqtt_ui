import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import EventsList from '../eventsList';
import SiteContext from '../../context/siteContext';

const DeviceAlarmsTab = () => {
    const siteContext = useContext(SiteContext);
    const siteId = useMemo(() => siteContext?.site?.id, [siteContext]);
    const deviceId = useMemo(() => siteContext?.device?.id, [siteContext]);

    return <View style={styles.container}>
        {deviceId && siteId && <EventsList siteId={siteId} deviceId={deviceId}/>}
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});

export default DeviceAlarmsTab;
