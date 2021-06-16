import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../../../component/listScroll';
import SiteContext from '../../../context/siteContext';
import DeviceBadge from '../../../component/listBadge/deviceBadge';

const SiteDevicesTab = () => {
    const siteContext = useContext(SiteContext);
    const site = useMemo(() => siteContext?.site, [siteContext]);

    return <View style={styles.container}>
        <ListScroll renderItem={(item) => <DeviceBadge item={item}/>} showPlaceholder={true} path={'devices'} url={'/site/devices?id=' + encodeURIComponent(site.id)}/>
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
