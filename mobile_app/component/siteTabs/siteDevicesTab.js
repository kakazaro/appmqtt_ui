import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../listScroll';
import { SiteContext } from '../../screen/siteScreen';
import DeviceBadge from '../listBadge/deviceBadge';

const SiteDevicesTab = () => {
    const siteContext = useContext(SiteContext);
    const site = useMemo(() => siteContext?.site, [siteContext]);

    return <View style={styles.container}>
        <ListScroll Component={DeviceBadge} showPlaceholder={true} path={'devices'} url={'/site/devices?id=' + encodeURIComponent(site.id)}/>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SiteDevicesTab;
