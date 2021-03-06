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
                        setError('Ch???c n??ng b??o c??o ??ang b??? t???m kh??a, vui l??ng th??? l???i sau');
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
                {!!loadError && <HelperText style={{ marginBottom: 5 }} type={'error'} visible={true}>L???i: {loadError}</HelperText>}
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 10 }}>
                    <Checkbox.Android
                        status={!!autoSetting[IsActive] ? 'checked' : 'unchecked'}
                        onPress={() => !disabled && setAutoSetting(last => ({ ...last, [IsActive]: !last[IsActive] }))}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={disabled}
                    />
                    <Text style={{ fontSize: 16 }} onPress={() => !disabled && setAutoSetting(last => ({ ...last, [IsActive]: !last[IsActive] }))}>B???t ch???c n??ng b??o c??o t??? ?????ng</Text>
                </View>

                <CustomInput
                    style={styles.textInput}
                    value={userContext.user.email}
                    label={'?????a ch??? nh???n email'}
                    onChangeText={() => false}
                    autoCapitalize={'none'}
                    textContentType={'emailAddress'}
                    disabled={true}
                />

                <View style={{ marginTop: 10 }}>
                    <Text>B??o c??o ?????nh k??? theo th??ng t???i</Text>
                    <TouchableRipple disabled={disabled} onPress={() => setShowRange(true)} style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, borderColor: colors.MORE_THAN_A_WEEK, borderStyle: 'solid', borderWidth: 1 }}>
                        <Text>{`ng??y ${autoSetting[Range] || RangeList[RangeList.length - 1]}`}</Text>
                    </TouchableRipple>
                </View>
                <Text style={{ marginTop: 0, fontSize: 12, color: colors.secondaryText }}>L??u ??: n???u th??ng kh??ng c?? ng??y ch??? ?????nh, b??o c??o s??? ???????c g???i v??o ng??y cu???i th??ng. v?? d???: ng??y 29, 30, 31.</Text>

                <Text style={{ marginTop: 10 }}>Lo???i b??o c??o</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Checkbox.Android
                        status={'checked'}
                        onPress={() => false}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={true}
                    />
                    <Text style={{ fontSize: 16 }}>B??o c??o ti??u chu???n</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Checkbox.Android
                        status={'unchecked'}
                        onPress={() => false}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={true}
                    />
                    <Text style={{ fontSize: 16 }}>B??o c??o theo khung gi???</Text>
                </View>
                <Text style={{ marginTop: 0, fontSize: 12, color: colors.secondaryText }}>Ch???c n??ng ch???n lo???i b??o c??o ??ang ???????c ph??t tri???n, hi???n t???i ch??? h??? tr??? "B??o c??o ti??u chu???n".</Text>

                <Button
                    mode='contained'
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE, width: '100%', marginTop: 25 }}
                    disabled={disabled || !siteId}
                    onPress={onSubmit}
                    loading={saving}
                >
                    L??u c??i ?????t
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
                <Dialog.Title>Ch???n ng??y b??o c??o</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView>
                        {RangeList.map((range) => <TouchableOpacity key={range} onPress={() => {
                            setAutoSetting(last => ({ ...last, [Range]: range }));
                            setShowRange(false);
                        }}>
                            <View style={{ margin: 5, paddingVertical: 10, paddingHorizontal: 5, backgroundColor: colors.bg1, borderRadius: 5 }}>
                                <Text style={{ fontSize: 18, color: colors.PHILIPPINE_ORANGE }}>{`ng??y ${range}`}</Text>
                            </View>
                        </TouchableOpacity>)}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button labelStyle={{ color: colors.PHILIPPINE_ORANGE }} onPress={() => setShowRange(false)}>????ng</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showRange]);

    return <View style={{ flex: 1 }}>
        {dom}
        {selectRangeDom}
        <ConfirmDialog
            show={success}
            title={'Th??nh c??ng!'}
            content={<Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                ???? l??u c??i ?????t th??nh c??ng.
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
