import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Checkbox, Dialog, HelperText, Portal, Text, TouchableRipple } from 'react-native-paper';
import SiteContext from '../../../../context/siteContext';
import ServerContext from '../../../../context/serverContext';
import serverError from '../../../../common/serverError';
import { colors } from '../../../../common/themes';
import CustomInput from '../../../../component/customInput';
import ConfirmDialog from '../../../../component/confirmDialog';
import UserContext from '../../../../context/userContext';

const EmailTo = 'email_to';
const Range = 'range';
const IsActive = 'is_active';

const RangeList = Array(31).fill('').map((_, i) => i + 1).reverse();

const IsLock = true;

const AutoReportsTab = () => {
    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState();

    const [saving, setSaving] = useState(false);
    const [autoSetting, setAutoSetting] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [showRange, setShowRange] = useState(false);

    const siteId = useMemo(() => siteContext?.site?.id, [siteContext]);

    useEffect(() => {
        setLoading(true);

        if (siteId) {
            (async () => {
                try {
                    const response = await serverContext.get('/auto/mail' + `?site_id=${encodeURIComponent(siteId)}`);
                    setAutoSetting(response.data || {});
                } catch (err) {
                    setLoadError(serverError.getError(err));
                }
                setLoading(false);
            })();
        }
    }, [siteId]);

    const dom = useMemo(() => {
        if (loading || !userContext?.user?.email) {
            return <ActivityIndicator style={{ marginTop: 20 }} animating={true} color={colors.PHILIPPINE_ORANGE}/>;
        }

        const onSubmit = () => {
            setError('');
            setSuccess(false);
            setSaving(true);

            (async () => {
                try {
                    if (!IsLock) {
                        await serverContext.post('/auto/mail/save', {
                            site_id: siteId, [Range]: autoSetting[Range] || RangeList[RangeList.length - 1], [EmailTo]: userContext.user.email, [IsActive]: !!autoSetting[IsActive] ? 1 : 0
                        });
                        setSuccess(true);
                    } else {
                        setError('Chức năng báo cáo đang bị tạm khóa, vui lòng thử lại sau');
                    }
                } catch (err) {
                    setError(serverError.getError(err));
                }
                setSaving(false);
            })();
        };

        const disabled = saving || !!loadError;

        return <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                {!!loadError && <HelperText style={{ marginBottom: 5 }} type={'error'} visible={true}>Lỗi: {loadError}</HelperText>}
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 10 }}>
                    <Checkbox.Android
                        status={!!autoSetting[IsActive] ? 'checked' : 'unchecked'}
                        onPress={() => !disabled && setAutoSetting(last => ({ ...last, [IsActive]: !last[IsActive] }))}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={disabled}
                    />
                    <Text style={{ fontSize: 16 }} onPress={() => !disabled && setAutoSetting(last => ({ ...last, [IsActive]: !last[IsActive] }))}>Bật chức năng báo cáo tự động</Text>
                </View>

                <CustomInput
                    style={styles.textInput}
                    value={userContext.user.email}
                    label={'Địa chỉ nhận email'}
                    onChangeText={() => false}
                    autoCapitalize={'none'}
                    textContentType={'emailAddress'}
                    disabled={true}
                />

                <View style={{ marginTop: 10 }}>
                    <Text>Báo cáo định kỳ theo tháng tại</Text>
                    <TouchableRipple disabled={disabled} onPress={() => setShowRange(true)} style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, borderColor: colors.MORE_THAN_A_WEEK, borderStyle: 'solid', borderWidth: 1 }}>
                        <Text>{`ngày ${autoSetting[Range] || RangeList[RangeList.length - 1]}`}</Text>
                    </TouchableRipple>
                </View>
                <Text style={{ marginTop: 0, fontSize: 12, color: colors.secondaryText }}>Lưu ý: nếu tháng không có ngày chỉ định, báo cáo sẽ được gửi vào ngày cuối tháng. ví dụ: ngày 29, 30, 31.</Text>

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
                    disabled={disabled || !siteId}
                    onPress={onSubmit}
                    loading={saving}
                >
                    Lưu cài đặt
                </Button>
                {!!error && <HelperText type={'error'}>
                    {error}
                </HelperText>}
            </View>
        </ScrollView>;
    }, [error, loading, loadError, saving, autoSetting, siteId]);

    const selectRangeDom = useMemo(() => {
        return <Portal>
            <Dialog visible={showRange} onDismiss={() => setShowRange(false)}>
                <Dialog.Title>Chọn ngày báo cáo</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView>
                        {RangeList.map((range) => <TouchableOpacity key={range} onPress={() => {
                            setAutoSetting(last => ({ ...last, [Range]: range }));
                            setShowRange(false);
                        }}>
                            <View style={{ margin: 5, paddingVertical: 10, paddingHorizontal: 5, backgroundColor: colors.bg1, borderRadius: 5 }}>
                                <Text style={{ fontSize: 18, color: colors.PHILIPPINE_ORANGE }}>{`ngày ${range}`}</Text>
                            </View>
                        </TouchableOpacity>)}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button labelStyle={{ color: colors.PHILIPPINE_ORANGE }} onPress={() => setShowRange(false)}>Đóng</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showRange]);

    return <View style={{ flex: 1 }}>
        {dom}
        {selectRangeDom}
        <ConfirmDialog
            show={success}
            title={'Thành công!'}
            content={<Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                Đã lưu cài đặt thành công.
            </Text>}
            onClose={() => setSuccess(false)}
            onOk={() => setSuccess(false)}
            isNegative={false}
            negativeText={''}
            positiveText={'OK'}
            mode={'text'}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1, marginTop: 10, paddingStart: 30, paddingEnd: 30, backgroundColor: 'white'
    }, textInput: {
        fontSize: 16, width: '100%', backgroundColor: 'white', marginTop: 10
    }
});

export default AutoReportsTab;
