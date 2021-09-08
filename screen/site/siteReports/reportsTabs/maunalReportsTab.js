import React, { useContext, useEffect, useMemo, useState } from 'react';
import ServerContext from '../../../../context/serverContext';
import SiteContext from '../../../../context/siteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Button, HelperText, Text, TouchableRipple } from 'react-native-paper';
import { colors } from '../../../../common/themes';
import { ScrollView, StyleSheet, View } from 'react-native';
import CustomInput from '../../../../component/customInput';
import constant from '../../../../common/constant';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import serverError from '../../../../common/serverError';
import ConfirmDialog from '../../../../component/confirmDialog';

const ManualReportsSetting = 'ManualReportsSetting';
const EmailTo = 'email_to';
const TimePicker = [
    {
        key: 'date_start',
        title: 'Báo cáo từ ngày'
    },
    {
        key: 'date_end',
        title: 'Báo cáo đến ngày'
    }
];

const ManualReportsTab = () => {
    const serverContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const [loading, setLoading] = useState(true);
    const [manualSetting, setManualSetting] = useState({});

    const [showPicker, setShowPicker] = useState('');

    const [sending, setSending] = useState(false);
    const [error, setError] = useState();
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
        if (loading) {
            return <ActivityIndicator style={{ marginTop: 20 }} animating={true} color={colors.PHILIPPINE_ORANGE}/>;
        }

        const emailError = manualSetting[EmailTo] && !constant.emailRegex.test(manualSetting[EmailTo]) ? 'Email không hợp lệ' : '';
        const dateError = manualSetting[TimePicker[0].key] > manualSetting[TimePicker[1].key] ? 'Khoảng thời gian báo cáo không hợp lệ' : '';

        const onSubmit = () => {
            setError('');
            setSuccess(false);
            setSending(true);

            (async () => {
                try {
                    await serverContext.get('/report/manual' +
                        `?site_id=${encodeURIComponent(siteId)}` +
                        `&date_start=${moment(manualSetting[TimePicker[0].key] || Date.now()).format('YYYY-MM-DD')}` +
                        `&date_end=${moment(manualSetting[TimePicker[1].key] || Date.now()).format('YYYY-MM-DD')}` +
                        `&email_to=${encodeURIComponent(manualSetting[EmailTo])}`);
                    setSuccess(true);
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
                    value={manualSetting[EmailTo] || ''}
                    label={'Địa chỉ email'}
                    onChangeText={text => setManualSetting(last => ({ ...last, [EmailTo]: text }))}
                    autoCapitalize={'none'}
                    textContentType={'emailAddress'}
                    disabled={loading}
                    returnKeyType={'done'}
                    onSubmitEditing={() => false}
                    error={emailError}
                />
                {TimePicker.map((type) => <View key={type.key} style={{ marginTop: 10 }}>
                    <Text>{type.title}</Text>
                    <TouchableRipple disabled={sending} onPress={() => setShowPicker(type.key)} style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, borderColor: colors.MORE_THAN_A_WEEK, borderStyle: 'solid', borderWidth: 1 }}>
                        <Text>{moment(manualSetting[type.key] || Date.now()).format('YYYY-MM-DD')}</Text>
                    </TouchableRipple>
                </View>)}

                {!!dateError && <HelperText type={'error'}>
                    {dateError}
                </HelperText>}

                <Button
                    mode='contained'
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE, width: '100%', marginTop: 25 }}
                    disabled={sending || !manualSetting[EmailTo] || !!emailError || !!dateError || !siteId}
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

    }, [loading, manualSetting, error, siteId, sending]);

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
