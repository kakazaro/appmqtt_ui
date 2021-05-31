import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ServerContext from '../../context/serverContext';
import SiteContext from '../../context/siteContext';
import { useFocusEffect } from '@react-navigation/native';
import { DataTable, HelperText, Text } from 'react-native-paper';
import StatusBanner from '../statusBanner';
import { colors } from '../../common/themes';
import { Placeholder, PlaceholderLine, ShineOverlay } from 'rn-placeholder';
import utility from '../../common/utility';

const DeviceOverviewTab = () => {
    const serviceContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const device = useMemo(() => siteContext?.device, [siteContext]);
    const deviceId = useMemo(() => device?.id, [device]);

    const [deviceDetail, setDeviceDetail] = useState();
    const [deviceDetailError, setDeviceDetailError] = useState();

    useFocusEffect(React.useCallback(() => {
        if (deviceId) {
            const uid = serviceContext.dataControl.registerSiteData({
                url: '/site/device/details?id=' + encodeURIComponent(deviceId),
                handler: setDeviceDetail,
                handlerError: setDeviceDetailError,
                duration: 30000
            });

            return () => {
                serviceContext.dataControl.unRegisterSiteData(uid);
            };
        }
    }, [deviceId, serviceContext]));

    const paramDom = useMemo(() => {
        let params = deviceDetail?.device?.paras || deviceDetail?.device?.params || deviceDetail?.device?.param;
        params = (!params?.length) ? Array(!!deviceDetailError ? 0 : 20).fill('') : params;
        const table = <DataTable>
            {params.map((param, index) => param ?
                <DataTable.Row key={index}>
                    <View style={{ flexDirection: 'row', minWidth: '40%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.primaryText, flex: 1, flexWrap: 'nowrap' }}>{utility.getDeviceTagName(param.name)}</Text>
                    </View>
                    <DataTable.Cell numeric>
                        <Text style={{ color: colors.secondaryText }}>{param.value}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Text style={{ color: colors.secondaryText }}>{param.unit}</Text>
                    </DataTable.Cell>
                </DataTable.Row>
                :
                <Placeholder Animation={ShineOverlay} key={index}>
                    <PlaceholderLine width={(Math.random() * 50 + 40)} height={22} noMargin={true} style={{ marginBottom: 5, marginHorizontal: 15 }}/>
                </Placeholder>
            )}
        </DataTable>;

        return <View style={{ marginTop: 3, backgroundColor: 'white' }}>
            <Text style={{ marginStart: 15, fontWeight: 'bold', paddingTop: 5, fontSize: 18, color: colors.primaryText }}>Thông số đo</Text>
            {!!deviceDetailError && <HelperText style={{ marginStart: 5 }} type={'error'} visible={true}>Lỗi: {deviceDetailError}</HelperText>}
            {table}
        </View>;
    }, [deviceDetail, deviceDetailError]);

    return <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
            <StatusBanner statusId={deviceDetail?.status || device?.status} title={'Trạng thái'}/>
            {paramDom}
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

export default DeviceOverviewTab;
