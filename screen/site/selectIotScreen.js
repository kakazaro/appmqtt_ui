import React, { useContext, useMemo, useState } from 'react';
import AppBarLayout from '../../component/appBarLayout';
import ListScroll from '../../component/listScroll';
import IotBadge from '../../component/listBadge/iotBadge';
import { Text, View } from 'react-native';
import { colors } from '../../common/themes';
import { Button } from 'react-native-paper';
import ConfirmDialog from '../../component/confirmDialog';
import ServerContext from '../../context/serverContext';
import serverError from '../../common/serverError';

const SelectIotScreen = ({ navigation, route }) => {
    const serverContext = useContext(ServerContext);

    const [isUsedIotPage, setIsUsedIotPage] = useState(true);
    const [addIot, setAddIot] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const site = useMemo(() => route?.params?.site, [route]);

    const confirmModal = useMemo(() => {
        const onAddIot = (iot) => {
            setLoading(true);
            setError('');

            (async () => {
                try {
                    await serverContext.post('/iot_device_assign', {
                        code: iot.code,
                        site_id: site.id
                    });
                    setAddIot(undefined);
                    navigation.replace('addDevice', { site: { ...site }, iot: { ...iot } });
                } catch (e) {
                    setError(serverError.getError(e));
                    setLoading(false);
                }
            })();
        };

        return <ConfirmDialog
            title={'Thêm thiết bị IOT'}
            content={<>
                <Text>Bạn có muốn cài đặt <Text style={{ fontWeight: 'bold' }}>{addIot?.name}</Text> vào trạm?</Text>
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                        Chú ý: một khi đã cài đặt thiết bị IOT vào trạm,
                        thì những trạm khác không thể dùng thiết bị IOT này nữa.
                    </Text>
                </View>
            </>}
            show={!!addIot}
            isNegative={false}
            dismissible={!loading}
            loading={loading}
            onClose={() => setAddIot(undefined)}
            error={error}
            onOk={() => onAddIot(addIot)}
        />;
    }, [site, addIot, loading, serverContext]);

    return <AppBarLayout title={'Thêm thiết bị'}>
        <View style={{ flex: 0, paddingStart: 15, backgroundColor: 'white', paddingBottom: 10 }}>
            <Text style={{ fontSize: 20, color: colors.primaryText }}>Bước 1: Chọn thiết bị IOT cho trạm</Text>
        </View>
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0, marginStart: 15, marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: colors.secondaryText, flex: 1 }}>{isUsedIotPage ? 'Thiết bị IOT đã cài đặt cho trạm này' : 'Tất cả các thiết bị IOT'}</Text>
                <Button
                    labelStyle={{ textTransform: 'none', color: colors.PHILIPPINE_ORANGE }}
                    onPress={() => setIsUsedIotPage(last => !last)}>{isUsedIotPage ? 'Thêm' : 'Trở lại'}</Button>
            </View>
            <View style={{ flex: 1 }}>
                {site?.id && isUsedIotPage && <ListScroll
                    renderItem={(item) => <IotBadge item={item} isSetup={true} onClick={() => navigation.replace('addDevice', { site: { ...site }, iot: { ...item } })}/>}
                    showPlaceholder={true}
                    path={'iot_devices'}
                    url={'/iot_device?site_id=' + encodeURIComponent(site.id)}
                    emptyMessage={'Chưa có thiết bị IOT nào được cài đặt\n Nhấn "Thêm" để thêm thiết bị IOT cho trạm'}
                />}
                {!isUsedIotPage && <ListScroll
                    renderItem={(item) => <IotBadge item={item} onClick={() => !item.site_id && setAddIot(item)}/>}
                    showPlaceholder={true}
                    path={'iot_devices'}
                    url={'/iot_device'}
                    emptyMessage={'Chưa có thiết bị IOT nào'}
                />}
            </View>
        </View>
        {confirmModal}
    </AppBarLayout>;
};

export default SelectIotScreen;
