import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../../../component/listScroll';
import SiteContext from '../../../context/siteContext';
import DeviceBadge from '../../../component/listBadge/deviceBadge';
import eventCenter from '../../../common/eventCenter';
import ServerContext from '../../../context/serverContext';
import IotDeviceBadge from '../../../component/listBadge/iotDeviceBadge';

const SiteDevicesTab = () => {
    const siteContext = useContext(SiteContext);
    const serverContext = useContext(ServerContext);
    const site = useMemo(() => siteContext?.site, [siteContext]);

    const [iotDevices, setIotDevices] = useState([]);

    useEffect(() => {
        if (site.id) {
            (async () => {
                try {
                    const response = await serverContext.get('/iot_device?site_id=' + encodeURIComponent(site.id));
                    if (response.data?.iot_devices?.length) {
                        setIotDevices(response.data.iot_devices);
                    }
                } catch (e) {
                    // ignore
                }
            })();
        }
    }, [serverContext, site]);

    return <View style={styles.container}>
        <ListScroll
            renderItem={(item) => <DeviceBadge item={item}/>}
            showPlaceholder={true}
            path={'devices'}
            url={'/site/devices?id=' + encodeURIComponent(site.id)}
            header={<>{iotDevices.map((iot) => <IotDeviceBadge key={iot.id} item={iot}/>)}</>}
            emptyMessage={'Chưa có thiết bị Inverter nào'}
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
