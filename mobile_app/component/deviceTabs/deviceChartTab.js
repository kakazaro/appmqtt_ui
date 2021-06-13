import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SimpleChar from '../chart/simpleChart';
import SiteContext from '../../context/siteContext';

const DeviceChartTab = () => {
    const siteContext = useContext(SiteContext);

    const chartDom = useMemo(() => siteContext?.device?.id ? <SimpleChar url={'/device/trend?id=' + encodeURIComponent(siteContext.device.id)} showTable={false} hideExpand={false}/> : <></>, [siteContext]);

    return <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
            {chartDom}
        </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
    }
});

export default DeviceChartTab;
