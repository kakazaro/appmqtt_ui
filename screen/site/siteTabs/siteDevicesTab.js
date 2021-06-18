import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../../../component/listScroll';
import SiteContext from '../../../context/siteContext';
import DeviceBadge from '../../../component/listBadge/deviceBadge';
import eventCenter from '../../../common/eventCenter';

const SiteDevicesTab = () => {
    const siteContext = useContext(SiteContext);
    const site = useMemo(() => siteContext?.site, [siteContext]);

    return <View style={styles.container}>
        <ListScroll
            renderItem={(item) => <DeviceBadge item={item}/>}
            showPlaceholder={true}
            path={'devices'}
            url={'/site/devices?id=' + encodeURIComponent(site.id)}
            listEvents={[eventCenter.eventNames.addNewDevice, eventCenter.eventNames.deleteDevice]}
            onEventDataChange={(eventName, data, setData) => {
                switch (eventName) {
                    case eventCenter.eventNames.addNewDevice:
                        setData(lastData => {
                            if (lastData?.length) {
                                return [data, ...lastData];
                            } else {
                                return [data];
                            }
                        });
                        break;
                    case  eventCenter.eventNames.deleteDevice:
                        setData(lastData => {
                            if (lastData?.length) {
                                return lastData.filter(d => d.id !== data.id);
                            }
                            return lastData;
                        });
                        break;
                }
            }}
        />
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
