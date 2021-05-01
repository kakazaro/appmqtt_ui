import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../listScroll';
import SiteBadge from '../listBadge/siteBadge';

const SitesTab = () => {

    return <View style={styles.container}>
        <ListScroll Component={SiteBadge} showPlaceholder={true} path={'sites'} url={'/site/list'}/>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default SitesTab;
