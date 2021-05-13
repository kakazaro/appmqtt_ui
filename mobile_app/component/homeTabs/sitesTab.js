import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../listScroll';
import SiteBadge from '../listBadge/siteBadge';
import eventCenter from '../../common/eventCenter';

const SitesTab = () => {
    return <View style={styles.container}>
        <ListScroll
            renderItem={(item) => <SiteBadge item={item}/>}
            showPlaceholder={true}
            path={'sites'}
            url={'/site/list'}
            listEvents={[eventCenter.eventNames.updateSiteName]}
            onEventDataChange={(eventName, data, setData) => {
                if (eventName === eventCenter.eventNames.updateSiteName) {
                    setData(lastData => {
                        if (lastData?.length) {
                            const newData = lastData.map(d => {
                                if (d.id === data.id) {
                                    d.newId = d.id + (Math.floor(Math.random() * 10000000) + '');
                                    d.name = data.name;
                                }
                                return d;
                            });
                            return [...newData];
                        }
                        return lastData;
                    });
                }
            }}
        />
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
