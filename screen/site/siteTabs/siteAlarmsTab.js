import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import EventsList from '../../../component/eventsList';
import SiteContext from '../../../context/siteContext';

const SiteAlarmsTab = () => {
    const siteContext = useContext(SiteContext);
    const siteId = useMemo(() => siteContext?.site?.id, [siteContext]);

    return <View style={styles.container}>
        {siteId && <EventsList siteId={siteId}/>}
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
});

export default SiteAlarmsTab;
