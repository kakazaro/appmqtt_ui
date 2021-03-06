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
import Clipboard from 'expo-clipboard';
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
            title={'X??a thi???t b???'}
            content={<>
                <Text>B???n c?? mu???n x??a thi???t b??? "<Text style={{ fontWeight: 'bold' }}>{device?.name}</Text>" kh??ng?</Text>
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Text style={styles.labelText}>
                        Ch?? ??: m???i d??? li???u li??n quan ?????n thi???t b??? s??? b??? x??a ho??n to??n v?? kh??ng th??? kh??i ph???c ???????c
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
                                                       Clipboard.setString(device.id);
                                                       Toast.show('???? copy ID Thi???t b??? v??o clipboard', { duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM, shadow: true, animation: true, hideOnPress: true, delay: 0 });
                                                   }}>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>Copy ID</Text>
                </TouchableOpacity>}
            </View>
            {isDone && <View style={{ flex: 1, width: '100%' }}>
                <Tab.Navigator tabBarOptions={{
                    labelStyle: { fontSize: 14, textTransform: 'none' },
                    tabStyle: { padding: 0 },
                    activeTintColor: colors.PHILIPPINE_ORANGE,
                    inactiveTintColor: colors.secondaryText,
                    indicatorStyle: { backgroundColor: colors.PHILIPPINE_ORANGE, width: (100 / 3 - 5 * 3) + '%', marginStart: '5%' },
                    style: { elevation: 0, borderBottomColor: colors.UNICORN_SILVER, borderBottomStyle: 'solid', borderBottomWidth: 1 }
                }}>
                    <Tab.Screen name='deviceOverview' options={{ title: 'Th??ng tin c?? b???n' }} component={DeviceOverviewTab}/>
                    <Tab.Screen name='deviceAlarms' options={{ title: 'S??? c???' }} component={DeviceAlarmsTab}/>
                    <Tab.Screen name='deviceChart' options={{ title: 'Th??ng tin ph??t ??i???n' }} component={DeviceChartTab}/>
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
