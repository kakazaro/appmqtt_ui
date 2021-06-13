import React, { useState, useContext, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View, } from 'react-native';
import { Avatar, Button, HelperText } from 'react-native-paper';
import { colors } from '../common/themes';
import ServerContext from '../context/serverContext';
import CustomInput from '../component/customInput';
import AppBarLayout from '../component/appBarLayout';
import serverError from '../common/serverError';
import eventCenter from '../common/eventCenter';

const AddSiteScreen = ({ navigation }) => {
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);
    const currencyRef = useRef(null);

    const serverContext = useContext(ServerContext);

    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [priceText, setPriceText] = useState('');
    const price = useMemo(() => parseFloat(priceText), [priceText]);
    const [currency, setCurrency] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const siteNameError = useMemo(() => siteName && (siteName.length < 4 || siteName.length > 54) ? 'Tên trạm điên không hợp lệ (4-54 ký tự)' : '', [siteName]);
    const priceError = useMemo(() => !priceText || (!(/[^\d.]/i.test(priceText)) && price && isFinite(price) && !isNaN(price) && price > 0) ? '' : 'Phải là số hợp lệ và lớn hơn 0', [priceText, price]);
    const currencyError = useMemo(() => currency && currency.length < 1 && currency.length > 8 ? 'Mệnh giá phải từ 1 đến 8 ký tự' : '', [currency]);

    const canRegister = useMemo(() => siteName && !siteNameError && priceText && !priceError && currency && !currencyError, [siteName, siteNameError, priceText, priceError, currency, currencyError]);

    const onRegisterClick = () => {
        if (loading || !canRegister) {
            return;
        }

        setLoading(true);
        setError('');
        (async () => {
            try {
                const response = await serverContext.post('/site', { name: siteName, describe: siteDescription, price, currency });
                if (response.data?.site) {
                    const site = {
                        id: 'new' + Math.floor(Math.random() * 10000000),
                        name: siteName,
                        status: 'normal',
                        product: 0,
                        workingHours: 0,
                        ...response.data.site
                    };
                    eventCenter.push(eventCenter.eventNames.addNewSite, site);
                    navigation.replace('site', { site });
                }
            } catch (err) {
                setError(serverError.getError(err));
                setLoading(false);
            }
        })();
    };

    return <AppBarLayout title={'Thêm Trạm Điện Mới'}>
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
                <Avatar.Icon size={75} icon='plus-network' color={'white'} style={{ backgroundColor: colors.PHILIPPINE_ORANGE }}/>
            </View>
            <View style={{ width: '90%' }}>
                <CustomInput
                    style={styles.textInput}
                    value={siteName}
                    label={'Tên Trạm điện*'}
                    onChangeText={text => setSiteName(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => descriptionRef.current.focus()}
                    error={siteNameError}
                />

                <CustomInput
                    ref={descriptionRef}
                    style={styles.textInput}
                    value={siteDescription}
                    label={'Miêu tả'}
                    onChangeText={text => setSiteDescription(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => priceRef.current.focus()}
                    error={''}
                />

                <CustomInput
                    ref={priceRef}
                    style={styles.textInput}
                    value={priceText}
                    label={'Đơn giá*'}
                    placeholder={'1000'}
                    onChangeText={text => setPriceText(text)}
                    textContentType={'password'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => currencyRef.current.focus()}
                    error={priceError}
                />

                <CustomInput
                    ref={currencyRef}
                    style={styles.textInput}
                    value={currency}
                    label={'Loại tiền tệ*'}
                    placeholder={'VNĐ, đ, $'}
                    onChangeText={text => setCurrency(text)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'done'}
                    onSubmitEditing={onRegisterClick}
                    error={currencyError}
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
                    Tạo trạm điện
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


export default AddSiteScreen;
