import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, Portal } from 'react-native-paper';
import { colors } from '../../common/themes';
import FlatButton from '../../component/flatButton';
import CustomInput from '../../component/customInput';
import ServerContext from '../../context/serverContext';
import SiteContext from '../../context/siteContext';
import { currency } from 'expo-localization';

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
            (async () => {
                try {
                    const response = await serverContext.axios.get('/site/overview?id=' + encodeURIComponent(site.id));
                    if (discard) {
                        return;
                    }
                    setSiteOverview(response.data.site);
                } catch (e) {
                    if (discard) {
                        return;
                    }
                    setLoadError('Error during load overview');
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
    useEffect(() => {
        setEditName(site?.name || '');
    }, [site]);

    const [showEditPrice, setShowEditPrice] = useState(false);
    const [editPrice, setEditPrice] = useState('');
    const [editCurrency, setEditCurrency] = useState('');
    const [errorEditPrice, setErrorEditPrice] = useState('');

    useEffect(() => {
        setEditName(site?.name || '');
    }, [siteOverview]);

    const appSetting = useMemo(() => {
        const disabled = !site || !siteOverview || loading || loadError;
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
                currentValue: loading ? 'đang tải...' : loadError ? 'Đã xảy ra lỗi!' : !siteOverview ? '' : (!siteOverview.price || !siteOverview.currency) ? 'chưa cài đặt' : `${siteOverview.price} ${siteOverview.currency}`,
                iconName: 'pencil',
                onPress: () => setShowEditPrice(true)
            }
        ];
    }, [site, siteOverview, loading]);

    const updateSite = (id, name, price, currency) => {
        return serverContext.axios.post('/site/update?id=' + encodeURIComponent(id), {
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
                    siteContext.updateSite({
                        ...site,
                        name: editName
                    });
                    setShowEditName(false);
                } catch (e) {
                    setErrorEditName('Đã có lỗi xảy ra');
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
        const errorPrice = !editPrice || (!(/[^\d.]/i.test(editPrice)) && price && isFinite(price) && !isNaN(price) && price > 0) ? '' : 'Số phải lớn hơn 0';
        const errorCurrency = editCurrency && editCurrency.length < 1 && editCurrency.length > 8 ? 'Mệnh giá phải từ 1 đến 8 ký tự' : '';
        const canChange = !errorPrice && editCurrency && !errorCurrency;

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
                } catch (e) {
                    setErrorEditPrice('Đã có lỗi xảy ra');
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

    return <ScrollView>
        <View style={{ marginTop: 10, backgroundColor: 'white' }}>
            {appSetting.map((setting, index) => <FlatButton
                key={index}
                {...setting}
                style={{ borderTopStyle: 'solid', borderTopWidth: index ? 1 : 0, borderTopColor: colors.UNICORN_SILVER }}
            />)}
        </View>
        {modalEditNameDom}
        {modalEditPriceDom}
    </ScrollView>;
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
