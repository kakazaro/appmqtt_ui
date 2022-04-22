import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, HelperText, IconButton, Portal, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import FlatButton from '../../component/flatButton';
import CustomInput from '../../component/customInput';
import ServerContext from '../../context/serverContext';
import SiteContext from '../../context/siteContext';
import AppBarLayout from '../../component/appBarLayout';
import eventCenter from '../../common/eventCenter';
import serverError from '../../common/serverError';
import ConfirmDialog from '../../component/confirmDialog';
import UserContext from '../../context/userContext';
import Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const priceKey = [
    { key: 'unit_price_td', title: 'Giá giờ thấp điểm' }, { key: 'unit_price_bt', title: 'Giá giờ bình thường' }, { key: 'unit_price_cd', title: 'Giá giờ cao điểm' }
];

const percentKey = [
    { key: 'discount', title: 'Chiết khấu (%)' }, { key: 'vat', title: 'VAT (%)' }
];

const SiteSettingScreen = ({ navigation }) => {
    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const site = useMemo(() => siteContext?.site, [siteContext]);
    const [siteOverview, setSiteOverview] = useState(undefined);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [showEditName, setShowEditName] = useState(false);
    const [editName, setEditName] = useState('');
    const [errorEditName, setErrorEditName] = useState('');

    const [showEditPrice, setShowEditPrice] = useState(false);
    const [editPrice, setEditPrice] = useState(priceKey.reduce((s, p) => ({ ...s, [p.key]: '' }), {}));
    const [editPercent, setEditPercent] = useState(percentKey.reduce((s, p) => ({ ...s, [p.key]: '' }), {}));
    const [editCurrency, setEditCurrency] = useState('');
    const [errorEditPrice, setErrorEditPrice] = useState('');

    useEffect(() => {
        let discard = false;

        if (site?.id) {
            setLoading(true);
            setLoadError('');

            (async () => {
                try {
                    const response = await serverContext.get('/site/overview?id=' + encodeURIComponent(site.id));
                    if (discard) {
                        return;
                    }
                    setEditName(site.name || '');
                    const siteOverview = response.data.site;
                    setSiteOverview(siteOverview);
                    setEditPrice(priceKey.reduce((s, p) => ({ ...s, [p.key]: ((siteOverview && siteOverview[p.key]) || '').toString() }), {}));
                    setEditPercent(percentKey.reduce((s, p) => ({ ...s, [p.key]: ((siteOverview && siteOverview[p.key]) || 0).toString() }), {}));
                    setEditCurrency(siteOverview?.currency || '');
                } catch (e) {
                    if (discard) {
                        return;
                    }
                    setLoadError(serverError.getError(e));
                }
                setLoading(false);
            })();
        }

        return () => {
            discard = true;
        };
    }, [site, serverContext]);

    const appSetting = useMemo(() => {
        const disabled = loading || loadError;
        const setting = [];
        // console.log(userContext.rolePermission)
        if (userContext.rolePermission.canEditName) {
            setting.push({
                title: 'Tên', currentValue: site?.name || '', disabled, iconName: 'pencil', onPress: () => setShowEditName(true)
            });
        }

        setting.push({
            title: 'Biểu giá', description: 'Giá tiền cho mỗi kWh', disabled, currentValue: '', iconName: 'pencil', onPress: () => setShowEditPrice(true)
        });
        setting.push({
            title: 'Báo cáo', disabled, onPress: () => navigation.navigate('siteReports')
        });
        return setting;
    }, [site, siteOverview, loading, navigation, userContext]);

    const updateSite = useCallback((updatedSite) => {
        console.log(updatedSite);
        return serverContext.post('/site/update?id=' + encodeURIComponent(updatedSite.id), {
            ...siteOverview, ...updatedSite, id: undefined,
        });
    }, [siteOverview]);

    const modalEditNameDom = useMemo(() => {
        const errorName = editName && editName.length < 4 || editName.length > 40 ? 'Tên trạm điện phải từ 4 đến 40 ký tự' : '';
        const canChange = editName && !errorName;

        const onChangeName = () => {
            setLoading(true);
            setErrorEditName('');

            (async () => {
                try {
                    const update = { id: site.id, name: editName };
                    await updateSite(update);
                    setShowEditName(false);
                    eventCenter.push(eventCenter.eventNames.updateSiteName, update);
                } catch (e) {
                    setErrorEditName(serverError.getError(e));
                }
                setLoading(false);
            })();
        };

        return <Portal>
            <Dialog visible={showEditName} dismissable={!loading} onDismiss={() => setShowEditName(false)}>
                <Dialog.Title>Sửa tên trạm điện</Dialog.Title>
                <Dialog.Content>
                    <CustomInput
                        style={styles.textInput}
                        value={editName}
                        label={'Tên trạm mới'}
                        onChangeText={editName => setEditName(editName)}
                        disabled={loading}
                        onSubmitEditing={onChangeName}
                        returnKeyType={'done'}
                        error={errorName}
                        isDialog={true}
                    />
                    {!!errorEditName && <HelperText type='error'>
                        {errorEditName}
                    </HelperText>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button style={{ minWidth: 70 }} labelStyle={{ color: colors.primaryText }} disabled={loading} onPress={() => setShowEditName(false)}>Hủy</Button>
                    <Button style={{ marginStart: 10, minWidth: 70, backgroundColor: colors.PHILIPPINE_ORANGE }} onPress={onChangeName} disabled={!canChange || loading}
                            loading={loading} mode='contained'>Sửa</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showEditName, editName, loading, serverContext, site, errorEditName, updateSite]);

    const currencyRef = useRef(null);
    const priceRef = useRef(Array(priceKey.length).fill(null));
    const percentRef = useRef(Array(percentKey.length).fill(null));

    const modalEditPriceDom = useMemo(() => {
        const priceParsed = Object.keys(editPrice).reduce((s, key) => {
            const price = parseInt(editPrice[key]);
            const error = !editPrice[key] || (!(/[^\d.]/i.test(editPrice[key])) && price && isFinite(price) && !isNaN(price) && price > 0) ? '' : 'Phải là số hợp lệ và lớn hơn 0';
            return { ...s, [key]: price, ['error_' + key]: error };
        }, {});
        const percentParsed = Object.keys(editPercent).reduce((s, key) => {
            const percent = parseFloat(editPercent[key]);
            const error = !editPercent[key] || (!(/[^\d.]/i.test(editPercent[key])) && isFinite(percent) && !isNaN(percent) && percent >= 0 && percent <= 100) ? '' : 'Phải là số hợp lệ và từ 0 đến 100';
            return { ...s, [key]: percent, ['error_' + key]: error };
        }, {});
        const errorCurrency = editCurrency && editCurrency.length < 1 && editCurrency.length > 8 ? 'Mệnh giá phải từ 1 đến 8 ký tự' : '';
        const canChange = priceKey.every(p => !!editPrice[p.key] && !priceParsed['error_' + p.key]) && percentKey.every(p => !!editPercent[p.key] && !percentParsed['error_' + p.key]) && editCurrency && !errorCurrency;

        const onChangePrice = () => {
            setLoading(true);
            setErrorEditPrice('');

            (async () => {
                try {
                    const update = {
                        id: site.id, ...priceKey.reduce((s, p) => ({ ...s, [p.key]: priceParsed[p.key] }), {}), ...percentKey.reduce((s, p) => ({
                            ...s, [p.key]: percentParsed[p.key]
                        }), {}), currency: editCurrency
                    };
                    await updateSite(update);
                    setShowEditPrice(false);
                    eventCenter.push(eventCenter.eventNames.updateSitePrice, update);
                } catch (e) {
                    setErrorEditPrice(serverError.getError(e));
                }
                setLoading(false);
            })();
        };

        return <Portal>
            <Dialog visible={showEditPrice} dismissable={!loading} onDismiss={() => setShowEditPrice(false)}>
                <Dialog.Content>
                    {priceKey.map((p, index) => <CustomInput
                        key={p.key}
                        ref={e => priceRef.current[index] = e}
                        style={styles.textInput}
                        value={editPrice[p.key]}
                        label={p.title}
                        placeholder={'1000'}
                        onChangeText={text => setEditPrice(last => ({ ...last, [p.key]: text }))}
                        disabled={loading || !userContext.rolePermission.canEditPrice}
                        onSubmitEditing={() => (index < priceKey.length - 1 ? priceRef.current[index + 1] : percentRef.current[0])?.focus()}
                        returnKeyType={'next'}
                        error={priceParsed['error_' + p.key]}
                        keyboardType={'numeric'}
                        isDialog={true}
                    />)}
                    {userContext.rolePermission.canSeePercent && percentKey.map((p, index) => <CustomInput
                        key={p.key}
                        ref={e => percentRef.current[index] = e}
                        style={styles.textInput}
                        value={editPercent[p.key]}
                        label={p.title}
                        placeholder={'8'}
                        onChangeText={text => setEditPercent(last => ({ ...last, [p.key]: text }))}
                        disabled={loading || !userContext.rolePermission.canEditPercent}
                        onSubmitEditing={() => (index < percentKey.length - 1 ? percentRef.current[index + 1] : currencyRef.current)?.focus()}
                        returnKeyType={'next'}
                        error={percentParsed['error_' + p.key]}
                        keyboardType={'numeric'}
                        isDialog={true}
                    />)}
                    {<CustomInput
                        ref={currencyRef}
                        style={styles.textInput}
                        value={editCurrency}
                        label={'Loại tiền tệ'}
                        placeholder={'VNĐ, đ, $'}
                        onChangeText={text => setEditCurrency(text)}
                        disabled={loading || !userContext.rolePermission.canEditPrice}
                        onSubmitEditing={() => (canChange && !loading) ? onChangePrice() : false}
                        returnKeyType={'done'}
                        error={errorCurrency}
                        isDialog={true}
                    />}
                    {!!errorEditPrice && <HelperText type='error'>
                        {errorEditPrice}
                    </HelperText>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button style={{ minWidth: 70 }} labelStyle={{ color: colors.primaryText }} disabled={loading} onPress={() => setShowEditPrice(false)}>Hủy</Button>
                    <Button style={{ marginStart: 10, minWidth: 70, backgroundColor: colors.PHILIPPINE_ORANGE }} onPress={onChangePrice}
                            disabled={!canChange || loading || (!userContext.rolePermission.canEditPrice && !userContext.rolePermission.canEditPercent)}
                            loading={loading} mode='contained'>Đổi</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showEditPrice, editPrice, editPercent, editCurrency, loading, serverContext, site, errorEditPrice, updateSite, userContext]);

    const [showDeleteSite, setShowDeleteSite] = useState(false);
    const [errorDeleteSite, setErrorDeleteSite] = useState('');

    const modalDeleteSiteDom = useMemo(() => {
        const onDelete = () => {
            setLoading(true);
            setErrorDeleteSite('');
            (async () => {
                try {
                    await serverContext.delete('/site?id=' + encodeURIComponent(site.id));
                    eventCenter.push(eventCenter.eventNames.deleteSite, site);
                    navigation.reset({
                        index: 0, routes: [{ name: 'home' }],
                    });
                } catch (e) {
                    setErrorDeleteSite(serverError.getError(e));
                    setLoading(false);
                }
            })();
        };

        return <ConfirmDialog
            title={'Xóa trạm'}
            content={<>
                <Text>Bạn có muốn xóa trạm "<Text style={{ fontWeight: 'bold' }}>{site?.name}</Text>" không?</Text>
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Text style={styles.labelText}>
                        Chú ý: mọi dữ liệu liên quan đến trạm sẽ bị xóa hoàn toàn và không thể khôi phục được
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
    }, [site, showDeleteSite, loading, errorDeleteSite, serverContext]);

    const dom = useMemo(() => {
        if (site && siteOverview && !loading && !loadError) {
            return <ScrollView>
                <View style={{ marginTop: 10 }}>
                    {appSetting.map((setting, index) => <FlatButton
                        iconName={'chevron-right'}
                        key={index}
                        {...setting}
                        style={{ borderTopStyle: 'solid', borderTopWidth: index ? 1 : 0, borderTopColor: colors.UNICORN_SILVER, backgroundColor: 'white' }}
                    />)}
                    {userContext.rolePermission.removeSite && <FlatButton
                        title={'Xóa trạm'}
                        iconName={'trash-can-outline'}
                        onPress={() => setShowDeleteSite(true)}
                        style={{ marginTop: 10, backgroundColor: 'white' }}
                        titleStyle={{ color: colors.fault }}
                        iconColor={colors.fault}
                    />}
                </View>
                {modalEditNameDom}
                {modalEditPriceDom}
                {modalDeleteSiteDom}
            </ScrollView>;
        } else if (loading && !loadError) {
            return <ActivityIndicator style={{ marginTop: 20 }} animating={true} color={colors.PHILIPPINE_ORANGE}/>;
        } else if (loadError) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{loadError}</Text>
            </View>;
        }
    }, [site, siteOverview, userContext, loading, loadError, appSetting, modalEditNameDom, modalEditPriceDom, modalDeleteSiteDom]);

    return <AppBarLayout
        title={'Cài đặt trạm'}
        menu={<IconButton icon={() => <MaterialCommunityIcons name='content-copy' size={24} color={colors.PHILIPPINE_ORANGE}/>}
                          onPress={() => {
                              Clipboard.setString(site?.id || '');
                              Toast.show('Đã copy ID Trạm vào clipboard', {
                                  duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM,
                                  shadow: true, animation: true, hideOnPress: true, delay: 0
                              });
                          }}/>}>
        {dom}
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    textInput: {
        fontSize: 16, width: '100%', backgroundColor: 'white', marginTop: 10
    }, labelText: {
        color: colors.secondaryText, fontSize: 12
    },
});

export default SiteSettingScreen;
