import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, HelperText, Portal, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import FlatButton from '../../component/flatButton';
import CustomInput from '../../component/customInput';
import ServerContext from '../../context/serverContext';
import SiteContext from '../../context/siteContext';
import AppBarLayout from '../../component/appBarLayout';
import eventCenter from '../../common/eventCenter';
import serverError from '../../common/serverError';

const SiteSettingScreen = () => {
    const serverContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const site = useMemo(() => siteContext?.site, [siteContext]);
    const [siteOverview, setSiteOverview] = useState();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

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
                    setEditPrice((siteOverview?.price || '') + '');
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

    const [showEditName, setShowEditName] = useState(false);
    const [editName, setEditName] = useState('');
    const [errorEditName, setErrorEditName] = useState('');

    const [showEditPrice, setShowEditPrice] = useState(false);
    const [editPrice, setEditPrice] = useState('');
    const [editCurrency, setEditCurrency] = useState('');
    const [errorEditPrice, setErrorEditPrice] = useState('');

    const appSetting = useMemo(() => {
        const disabled = loading || loadError;
        return [
            {
                title: 'Tên',
                currentValue: site?.name || '',
                disabled,
                iconName: 'pencil',
                onPress: () => setShowEditName(true)
            },
            {
                title: 'Biểu giá',
                description: 'Giá tiền cho mỗi kWh',
                disabled,
                currentValue: !siteOverview ? '' : (!siteOverview.price || !siteOverview.currency) ? 'chưa cài đặt' : `${siteOverview.price} ${siteOverview.currency}`,
                iconName: 'pencil',
                onPress: () => setShowEditPrice(true)
            }
        ];
    }, [site, siteOverview, loading]);

    const updateSite = (id, name, price, currency) => {
        return serverContext.post('/site/update?id=' + encodeURIComponent(id), {
            name: name || 'Station name',
            price: price || 0,
            currency: currency || ''
        });
    };

    const modalEditNameDom = useMemo(() => {
        const errorName = editName && editName.length < 4 || editName.length > 40 ? 'Tên trạm điện phải từ 4 đến 40 ký tự' : '';
        const canChange = editName && !errorName;

        const onChangeName = () => {
            setLoading(true);
            setErrorEditName('');

            (async () => {
                try {
                    await updateSite(site.id, editName, siteOverview?.price, siteOverview?.currency);
                    setShowEditName(false);
                    eventCenter.push(eventCenter.eventNames.updateSiteName, {
                        id: site.id,
                        name: editName
                    });
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
                    <Button style={{ marginStart: 10, minWidth: 70, backgroundColor: colors.PHILIPPINE_ORANGE }} onPress={onChangeName} disabled={!canChange || loading} loading={loading} mode='contained'>Sửa</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showEditName, editName, loading, serverContext, site, siteOverview, errorEditName]);

    const currencyRef = useRef();

    const modalEditPriceDom = useMemo(() => {
        const price = parseFloat(editPrice);
        const errorPrice = !editPrice || (!(/[^\d.]/i.test(editPrice)) && price && isFinite(price) && !isNaN(price) && price > 0) ? '' : 'Phải là số hợp lệ và lớn hơn 0';
        const errorCurrency = editCurrency && editCurrency.length < 1 && editCurrency.length > 8 ? 'Mệnh giá phải từ 1 đến 8 ký tự' : '';
        const canChange = editPrice && !errorPrice && editCurrency && !errorCurrency;

        const onChangePrice = () => {
            setLoading(true);
            setErrorEditPrice('');

            (async () => {
                try {
                    await updateSite(site.id, site.name, price, editCurrency);
                    setSiteOverview({
                        ...siteOverview,
                        price,
                        currency: editCurrency
                    });
                    setShowEditPrice(false);
                    eventCenter.push(eventCenter.eventNames.updateSitePrice, {
                        id: site.id,
                        price,
                        currency: editCurrency
                    });
                } catch (e) {
                    setErrorEditPrice(serverError.getError(e));
                }
                setLoading(false);
            })();
        };

        return <Portal>
            <Dialog visible={showEditPrice} dismissable={!loading} onDismiss={() => setShowEditPrice(false)}>
                <Dialog.Content>
                    <CustomInput
                        style={styles.textInput}
                        value={editPrice}
                        label={'Giá mới'}
                        placeholder={'1000'}
                        onChangeText={text => setEditPrice(text)}
                        disabled={loading}
                        onSubmitEditing={() => currencyRef?.current?.focus()}
                        returnKeyType={'next'}
                        error={errorPrice}
                        keyboardType={'numeric'}
                        isDialog={true}
                    />
                    <CustomInput
                        ref={currencyRef}
                        style={styles.textInput}
                        value={editCurrency}
                        label={'Loại tiền tệ'}
                        placeholder={'VNĐ, đ, $'}
                        onChangeText={text => setEditCurrency(text)}
                        disabled={loading}
                        onSubmitEditing={onChangePrice}
                        returnKeyType={'done'}
                        error={errorCurrency}
                        isDialog={true}
                    />
                    {!!errorEditPrice && <HelperText type='error'>
                        {errorEditPrice}
                    </HelperText>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button style={{ minWidth: 70 }} labelStyle={{ color: colors.primaryText }} disabled={loading} onPress={() => setShowEditPrice(false)}>Hủy</Button>
                    <Button style={{ marginStart: 10, minWidth: 70, backgroundColor: colors.PHILIPPINE_ORANGE }} onPress={onChangePrice} disabled={!canChange || loading} loading={loading} mode='contained'>Đổi</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showEditPrice, editPrice, editCurrency, loading, serverContext, site, siteOverview, errorEditPrice]);

    const dom = useMemo(() => {
        if (site && siteOverview && !loading && !loadError) {
            return <ScrollView>
                <View style={{ marginTop: 10, backgroundColor: 'white' }}>
                    {appSetting.map((setting, index) => <FlatButton
                        iconName={'chevron-right'}
                        key={index}
                        {...setting}
                        style={{ borderTopStyle: 'solid', borderTopWidth: index ? 1 : 0, borderTopColor: colors.UNICORN_SILVER }}
                    />)}
                </View>
                {modalEditNameDom}
                {modalEditPriceDom}
            </ScrollView>;
        } else if (loading && !loadError) {
            return <ActivityIndicator style={{ marginTop: 20 }} animating={true} color={colors.PHILIPPINE_ORANGE}/>;
        } else if (loadError) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{loadError}</Text>
            </View>;
        }


    }, [site, siteOverview, loading, loadError, appSetting, modalEditNameDom, modalEditPriceDom]);

    return <AppBarLayout title={'Cài đặt trạm'}>
        {dom}
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    textInput: {
        fontSize: 16,
        width: '100%',
        backgroundColor: 'white',
        marginTop: 10
    }
});

export default SiteSettingScreen;
