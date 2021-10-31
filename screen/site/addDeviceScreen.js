import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import AppBarLayout from '../../component/appBarLayout';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../common/themes';
import CustomInput from '../../component/customInput';
import { Button, Dialog, HelperText, Portal } from 'react-native-paper';
import isIp from 'is-ip';
import { portValidator } from 'port-validator';
import eventCenter from '../../common/eventCenter';
import serverError from '../../common/serverError';
import ServerContext from '../../context/serverContext';
import utility from '../../common/utility';

const AddDeviceScreen = ({ navigation, route }) => {
    const { site, iot } = useMemo(() => route?.params || {}, [route]);

    const serverContext = useContext(ServerContext);

    const descriptionRef = useRef(null);
    const nameplateWattsRef = useRef(null);
    const ipRef = useRef(null);
    const portRef = useRef(null);

    const [deviceName, setDeviceName] = useState('');
    const [deviceDescription, setDeviceDescription] = useState('');
    const [nameplateWatts, setNameplateWatts] = useState('');
    const [ip, setIp] = useState('');
    const [port, setPort] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const deviceNameError = useMemo(() => deviceName && (deviceName.length < 4 || deviceName.length > 54) ? 'Tên thiết bị không hợp lệ (4-54 ký tự)' : '', [deviceName]);
    const nameplateWattsError = useMemo(() => nameplateWatts && (!isFinite(parseFloat(nameplateWatts)) || isNaN(parseFloat(nameplateWatts)) || parseFloat(nameplateWatts) < 0) ? 'Số không hợp lệ' : '', [nameplateWatts]);
    const ipError = useMemo(() => ip && !isIp.v4(ip) ? 'IP không hợp lệ' : '', [ip]);
    const portError = useMemo(() => port && (!portValidator(port).validate() || !isFinite(parseInt(port)) || isNaN(parseInt(port)) || parseInt(port) < 0) ? 'Port không hợp lệ' : '', [port]);

    const [deviceType, setDeviceType] = useState(undefined);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [showSelectDeviceType, setShowSelectDeviceType] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await serverContext.get('/device_type');
                if (response.data?.device_types?.length) {
                    setDeviceTypes(response.data.device_types);
                    setLoading(false);
                }
            } catch (e) {

            }
        })();
    }, [serverContext]);

    const selectDeviceTypeDom = useMemo(() => {
        return <Portal>
            <Dialog visible={showSelectDeviceType} onDismiss={() => setShowSelectDeviceType(false)}>
                <Dialog.Title>Chọn loại Inverter</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView>
                        {deviceTypes.map((type) => <TouchableOpacity key={type.id} onPress={() => {
                            setDeviceType(type);
                            setShowSelectDeviceType(false);
                        }}>
                            <View style={{ margin: 5, paddingVertical: 10, paddingHorizontal: 5, backgroundColor: colors.bg1, borderRadius: 5 }}>
                                <Text style={{ fontSize: 18, color: colors.PHILIPPINE_ORANGE }}>{type.name}</Text>
                            </View>
                        </TouchableOpacity>)}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button labelStyle={{ color: colors.PHILIPPINE_ORANGE }} onPress={() => setShowSelectDeviceType(false)}>Đóng</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showSelectDeviceType, deviceTypes]);

    const canRegister = useMemo(() => deviceName && deviceType && !deviceNameError && nameplateWatts && !nameplateWattsError && ip && !ipError && port && !portError, [deviceName, deviceType, deviceNameError, nameplateWatts, nameplateWattsError, ip, ipError, port, portError]);

    const onRegisterClick = () => {
        if (loading || !canRegister) {
            return;
        }

        setLoading(true);
        setError('');
        (async () => {
            try {
                const response = await serverContext.post('/device', {
                    name: deviceName,
                    code: deviceName,
                    describe: deviceDescription,
                    station: site.id,
                    iot_device: iot.id,
                    device_type: deviceType.id,
                    nameplateWatts: parseFloat(nameplateWatts) * 1000,
                    IP: ip,
                    port: parseInt(port)
                });
                if (response.data?.device) {
                    const device = {
                        id: response.data.device._id,
                        name: deviceName,
                        status: utility.STATUS.OFFLINE.id,
                        curActPower: 0,
                        todayEnergy: 0,
                        ...response.data.device
                    };
                    eventCenter.push(eventCenter.eventNames.addNewDevice, device);
                    navigation.replace('device', { device });
                }
            } catch (err) {
                setError(serverError.getError(err));
                setLoading(false);
            }
        })();
    };

    return <AppBarLayout title={'Thêm Inverter'}>
        <View style={{ flex: 0, paddingStart: 15, backgroundColor: 'white', paddingBottom: 10 }}>
            <Text style={{ fontSize: 20, color: colors.primaryText }}>Bước 2: Nhập thông tin Inverter</Text>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                <CustomInput
                    style={styles.textInput}
                    value={iot?.name}
                    label={'Thiết bị IOT'}
                    disabled={true}
                />

                <Button
                    mode='text'
                    icon={deviceType ? '' : 'chevron-down'}
                    labelStyle={{ color: colors.secondaryText, textTransform: 'none' }}
                    style={{ width: '100%', marginTop: 15, borderColor: colors.secondaryText, borderWidth: 2 }}
                    disabled={loading}
                    onPress={() => setShowSelectDeviceType(true)}
                    loading={loading}
                >
                    {deviceType ? deviceType.name : 'Chọn loại Inverter*'}
                </Button>

                <CustomInput
                    style={styles.textInput}
                    value={deviceName}
                    label={'Tên Inverter*'}
                    onChangeText={text => setDeviceName(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => descriptionRef.current.focus()}
                    error={deviceNameError}
                />

                <CustomInput
                    ref={descriptionRef}
                    style={styles.textInput}
                    value={deviceDescription}
                    label={'Miêu tả'}
                    onChangeText={text => setDeviceDescription(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => nameplateWattsRef.current.focus()}
                    error={''}
                />

                <CustomInput
                    ref={nameplateWattsRef}
                    style={styles.textInput}
                    value={nameplateWatts}
                    label={'Công suất định danh (kWp)*'}
                    onChangeText={text => setNameplateWatts(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => ipRef.current.focus()}
                    error={nameplateWattsError}
                />

                <CustomInput
                    ref={ipRef}
                    style={styles.textInput}
                    value={ip}
                    label={'IP*'}
                    placeholder={'192.168.0.1'}
                    onChangeText={text => setIp(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => portRef.current.focus()}
                    error={ipError}
                />

                <CustomInput
                    ref={portRef}
                    style={styles.textInput}
                    value={port}
                    label={'Port*'}
                    placeholder={'8080'}
                    onChangeText={text => setPort(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'done'}
                    onSubmitEditing={onRegisterClick}
                    error={portError}
                />

                {!!error && <HelperText type='error'>
                    {error}
                </HelperText>}
                <Button
                    mode='contained'
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE, width: '100%', marginTop: 25 }}
                    disabled={loading || !canRegister}
                    onPress={onRegisterClick}
                    loading={loading}
                >
                    Tạo Inverter
                </Button>
                <Button
                    color={colors.PHILIPPINE_ORANGE}
                    style={{ width: '100%', marginTop: 10 }}
                    labelStyle={{ fontSize: 13, textTransform: 'none' }}
                    disabled={loading}
                    onPress={() => navigation.goBack()}
                >
                    Hủy
                </Button>
            </View>
        </ScrollView>
        {selectDeviceTypeDom}
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingStart: 30,
        paddingEnd: 30,
        backgroundColor: 'white'
    },
    textInput: {
        fontSize: 16,
        width: '100%',
        backgroundColor: 'white',
        marginTop: 10
    }
});

export default AddDeviceScreen;
