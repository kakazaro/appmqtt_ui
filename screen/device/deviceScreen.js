import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppBarLayout from '../../component/appBarLayout';
import { Headline, IconButton, Text } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../../common/themes';
import DeviceOverviewTab from './deviceTabs/deviceOverviewTab';
import DeviceAlarmsTab from './deviceTabs/deviceAlarmsTab';
import DeviceChartTab from './deviceTabs/deviceChartTab';
import SiteContext from '../../context/siteContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UserContext from '../../context/userContext';
import eventCenter from '../../common/eventCenter';
import serverError from '../../common/serverError';
import ConfirmDialog from '../../component/confirmDialog';
import ServerContext from '../../context/serverContext';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

const Tab = createMaterialTopTabNavigator();

const DeviceScreen = ({ navigation, route }) => {
    const userContext = useContext(UserContext);
    const siteContext = useContext(SiteContext);
    const serverContext = useContext(ServerContext);

    const device = useMemo(() => route?.params?.device, [route]);
    const [isDone, setIsDone] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showDeleteSite, setShowDeleteSite] = useState(false);
    const [errorDeleteSite, setErrorDeleteSite] = useState('');

    useEffect(() => {
        siteContext.updateDevice(device);
        setIsDone(true);
    }, [device]);

    const menu = useMemo(() => {
        return <>
            {userContext.rolePermission.removeDevice && <IconButton icon={() => <MaterialCommunityIcons name='trash-can-outline' size={24} color={colors.fault}/>} onPress={() => setShowDeleteSite(true)}/>}
        </>;
    }, [userContext]);

    const modalDeleteDeviceDom = useMemo(() => {
        const onDelete = () => {
            setLoading(true);
            setErrorDeleteSite('');
            (async () => {
                try {
                    await serverContext.delete('/device?id=' + encodeURIComponent(device.id));
                    eventCenter.push(eventCenter.eventNames.deleteDevice, device);
                    navigation.goBack();
                } catch (e) {
                    setErrorDeleteSite(serverError.getError(e));
                    setLoading(false);
                }
            })();
        };

        return <ConfirmDialog
            title={'Xóa thiết bị'}
            content={<>
                <Text>Bạn có muốn xóa thiết bị "<Text style={{ fontWeight: 'bold' }}>{device?.name}</Text>" không?</Text>
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Text style={styles.labelText}>
                        Chú ý: mọi dữ liệu liên quan đến thiết bị sẽ bị xóa hoàn toàn và không thể khôi phục được
                    </Text>
                </View>
            </>}
            show={showDeleteSite}
            dismissible={!loading}
            loading={loading}
            isNegative={true}
            error={errorDeleteSite}
            onClose={() => setShowDeleteSite(false)}
            onOk={onDelete}
            countDown={10}
        />;
    }, [device, showDeleteSite, loading, errorDeleteSite, serverContext]);

    return <AppBarLayout menu={menu}>
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', backgroundColor: 'white', width: '100%', paddingStart: 15, paddingEnd: 15, paddingBottom: 5, alignItems: 'center' }}>
                <Headline style={{ flex: 1, margin: 0, color: colors.PHILIPPINE_ORANGE }}>{device?.name}</Headline>
                {!!device?.id && <TouchableOpacity style={{ backgroundColor: colors.UNICORN_SILVER, padding: 5, borderRadius: 5 }}
                                                   onPress={() => {
                                                       Clipboard.setStringAsync(device.id)
                                                           .then(() => Toast.show('Đã copy ID Thiết bị vào clipboard', {
                                                               duration: Toast.durations.SHORT,
                                                               position: Toast.positions.BOTTOM,
                                                               shadow: true,
                                                               animation: true,
                                                               hideOnPress: true,
                                                               delay: 0,
                                                           }));
                                                   }}>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>Copy ID</Text>
                </TouchableOpacity>}
            </View>
            {isDone && <View style={{ flex: 1, width: '100%' }}>
                <Tab.Navigator>
                    <Tab.Screen name='deviceOverview' options={{ title: 'Thông tin cơ bản' }} component={DeviceOverviewTab}/>
                    <Tab.Screen name='deviceAlarms' options={{ title: 'Sự cố' }} component={DeviceAlarmsTab}/>
                    <Tab.Screen name='deviceChart' options={{ title: 'Thông tin phát điện' }} component={DeviceChartTab}/>
                </Tab.Navigator>
            </View>}
        </View>
        {modalDeleteDeviceDom}
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%'
    },
});


export default DeviceScreen;
