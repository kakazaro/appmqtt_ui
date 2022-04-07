import React, { useContext, useEffect, useMemo, useState } from 'react';
import ServerContext from '../../../../context/serverContext';
import SiteContext from '../../../../context/siteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Button, Checkbox, HelperText, Text, TouchableRipple } from 'react-native-paper';
import { colors } from '../../../../common/themes';
import { ScrollView, StyleSheet, View } from 'react-native';
import CustomInput from '../../../../component/customInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import serverError from '../../../../common/serverError';
import ConfirmDialog from '../../../../component/confirmDialog';
import UserContext from '../../../../context/userContext';

const ManualReportsSetting = 'ManualReportsSetting';
const TimePicker = [
    {
        key: 'date_end',
        title: 'Báo cáo đến ngày'
    }
];

const IsLock = true;

const ManualReportsTab = () => {
    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const [loading, setLoading] = useState(true);
    const [manualSetting, setManualSetting] = useState({});

    const [showPicker, setShowPicker] = useState('');

    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const siteId = useMemo(() => siteContext?.site?.id, [siteContext]);

    useEffect(() => {
        setLoading(true);

        (async () => {
            const setting = await AsyncStorage.getItem(ManualReportsSetting);
            try {
                setManualSetting(JSON.parse(setting));
            } catch (e) {
                // ignore
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await AsyncStorage.setItem(ManualReportsSetting, JSON.stringify(manualSetting || {}));
        })();
    }, [manualSetting]);

    const dateTimePickerDom = useMemo(() => {
        if (showPicker) {
            return <DateTimePicker
                value={new Date(manualSetting[showPicker] || Date.now())}
                mode={'date'}
                is24Hour={true}
                display='default'
                onChange={(event, date) => {
                    setShowPicker('');
                    if (date) {
                        setManualSetting(last => ({ ...last, [showPicker]: moment(date).toDate().getTime() }));
                    }
                }}
                maximumDate={new Date()}
            />;
        }
    }, [showPicker, manualSetting]);

    const dom = useMemo(() => {
        if (loading || !userContext?.user?.email) {
            return <ActivityIndicator style={{ marginTop: 20 }} animating={true} color={colors.PHILIPPINE_ORANGE}/>;
        }

        const onSubmit = () => {
            setError('');
            setSuccess(false);
            setSending(true);

            (async () => {
                try {
                    if (!IsLock) {
                        await serverContext.get('/report/manual' +
                            `?site_id=${encodeURIComponent(siteId)}` +
                            `&date_start=${moment(manualSetting[TimePicker[0].key] || Date.now()).format('YYYY-MM-DD')}` +
                            `&date_end=${moment(manualSetting[TimePicker[1].key] || Date.now()).format('YYYY-MM-DD')}` +
                            `&email_to=${encodeURIComponent(userContext.user.email)}`);
                        setSuccess(true);
                    } else {
                        setError('Chức năng báo cáo đang bị tạm khóa, vui lòng thử lại sau');
                    }
                } catch (err) {
                    setError(serverError.getError(err));
                }
                setSending(false);
            })();
        };

        return <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                <CustomInput
                    style={styles.textInput}
                    value={userContext.user.email}
                    label={'Địa chỉ nhận email'}
                    onChangeText={() => false}
                    autoCapitalize={'none'}
                    textContentType={'emailAddress'}
                    disabled={true}
                />
                {TimePicker.map((type) => <View key={type.key} style={{ marginTop: 10 }}>
                    <Text>{type.title}</Text>
                    <TouchableRipple disabled={sending} onPress={() => setShowPicker(type.key)} style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, borderColor: colors.MORE_THAN_A_WEEK, borderStyle: 'solid', borderWidth: 1 }}>
                        <Text>{moment(manualSetting[type.key] || Date.now()).format('YYYY-MM-DD')}</Text>
                    </TouchableRipple>
                </View>)}

                <Text style={{ marginTop: 10 }}>Loại báo cáo</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Checkbox.Android
                        status={'checked'}
                        onPress={() => false}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={true}
                    />
                    <Text style={{ fontSize: 16 }}>Báo cáo tiêu chuẩn</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Checkbox.Android
                        status={'unchecked'}
                        onPress={() => false}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={true}
                    />
                    <Text style={{ fontSize: 16 }}>Báo cáo theo khung giờ</Text>
                </View>
                <Text style={{ marginTop: 0, fontSize: 12, color: colors.secondaryText }}>Chức năng chọn loại báo cáo đang được phát triển, hiện tại chỉ hỗ trợ "Báo cáo tiêu chuẩn".</Text>

                <Button
                    mode='contained'
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE, width: '100%', marginTop: 25 }}
                    disabled={sending || !siteId}
                    onPress={onSubmit}
                    loading={sending}
                >
                    Gửi Báo Cáo
                </Button>
                {!!error && <HelperText type={'error'}>
                    {error}
                </HelperText>}
            </View>
        </ScrollView>;

    }, [loading, manualSetting, error, siteId, sending, userContext]);

    return <View style={{ flex: 1 }}>
        {dom}
        {dateTimePickerDom}
        <ConfirmDialog
            show={success}
            title={'Gửi báo cáo thành công!'}
            content={
                <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                    Chúng tôi đã gửi một file báo cáo đến email của bạn, vui lòng kiểm tra hòm thư để xem báo cáo.
                    (Kiểm tra hòm thư rác nếu cần)
                </Text>
            }
            onClose={() => setSuccess(false)}
            onOk={() => setSuccess(false)}
            isNegative={false}
            negativeText={''}
            positiveText={'Đã hiểu'}
            mode={'text'}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
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


export default ManualReportsTab;
