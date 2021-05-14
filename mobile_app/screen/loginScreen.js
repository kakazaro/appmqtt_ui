import React, { useState, useContext, useMemo, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, } from 'react-native';
import { Avatar, Button, Checkbox, Text, Portal, Dialog, HelperText } from 'react-native-paper';
import { colors } from '../common/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../context/userContext';
import constant from '../common/constant';
import ServerContext from '../context/serverContext';
import * as Analytics from 'expo-firebase-analytics';
import { useFocusEffect } from '@react-navigation/native';
import CustomInput from '../component/customInput';
import AppBarLayout from '../component/appBarLayout';
import serverError from '../common/serverError';

const RememberKey = 'RememberKey';
const RememberIdKey = 'RememberIdKey';
const RememberPasswordKey = 'RememberPasswordKey';

const LoginScreen = ({ navigation, route }) => {
    const passwordRef = useRef(null);


    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);

    const [email, setEmail] = useState(route?.params?.email || '');
    const [password, setPassword] = useState(route?.params?.password || '');
    const [rememberPassword, setRememberPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const emailError = useMemo(() => email && !constant.emailRegex.test(email) ? 'Email không hợp lệ' : '', [email]);
    const canLogin = useMemo(() => email && !emailError && password, [emailError, email, password]);

    useFocusEffect(React.useCallback(() => {
        (async () => {
            const isRemember = !!(await AsyncStorage.getItem(RememberKey)) || false;
            setRememberPassword(isRemember);

            if (isRemember) {
                try {
                    const email = await AsyncStorage.getItem(RememberIdKey) || '';
                    let password = route?.params?.changedPassword ? '' : (await AsyncStorage.getItem(RememberPasswordKey) || '');
                    setEmail(email);
                    setPassword(password);
                } catch (e) {
                    // ignore
                }
            }

            setLoading(false);
        })();
    }, []));

    const onLoginClick = () => {
        if (loading || !canLogin) {
            return;
        }

        setLoading(true);
        setError('');
        (async () => {
            try {
                await Analytics.logEvent('loginBtnClick');
            } catch (e) {
                //Ignore
            }
            try {
                const response = await serverContext.axios.post('/users/login', { email: email.toLowerCase(), password });
                await AsyncStorage.setItem(RememberKey, rememberPassword ? 'true' : '');
                await AsyncStorage.setItem(RememberIdKey, rememberPassword ? email : '');
                await AsyncStorage.setItem(RememberPasswordKey, rememberPassword ? password : '');
                setLoading(false);
                if (await userContext.login(response.data)) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'home' }],
                    });
                } else {
                    setError('Dữ liệu đăng nhập không hợp lệ');
                    setLoading(false);
                }
            } catch (err) {
                setError(serverError.getError(err));
                setLoading(false);
            }
        })();
    };

    const [showInfoModal, setShowInfoModal] = useState(false);


    const width = Dimensions.get('window').width;

    return <AppBarLayout title={'Đăng Nhập'}>
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Avatar.Image size={width > 500 ? 340 : 240} source={require('../assets/picture/solar.jpg')} style={{ backgroundColor: 'white' }}/>
            </View>
            <View style={{ width: width > 500 ? 370 : 270 }}>
                <CustomInput
                    style={styles.textInput}
                    value={email}
                    keyboardType={'email-address'}
                    label={'Email đăng nhập'}
                    textContentType={'emailAddress'}
                    autoCapitalize={'none'}
                    onChangeText={email => setEmail(email)}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    error={emailError}
                />
                <CustomInput
                    ref={passwordRef}
                    style={styles.textInput}
                    value={password}
                    label={'Mật khẩu'}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                    textContentType={'password'}
                    disabled={loading}
                    onSubmitEditing={onLoginClick}
                    returnKeyType={'done'}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 20 }}>
                    <Checkbox
                        status={rememberPassword ? 'checked' : 'unchecked'}
                        onPress={() => !loading && setRememberPassword(!rememberPassword)}
                        color={colors.PHILIPPINE_ORANGE}
                        disabled={loading}
                    />
                    <Text style={{ fontSize: 16 }} onPress={() => !loading && setRememberPassword(!rememberPassword)}>Nhớ mật tài khoản và mật khẩu</Text>
                </View>

                {!!error && <HelperText type='error'>
                    {error}
                </HelperText>}
                <Button
                    mode='contained'
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE, width: '100%', marginTop: 5 }}
                    disabled={loading || !canLogin}
                    onPress={onLoginClick}
                    loading={loading}
                >
                    Đăng Nhập
                </Button>
                <Button
                    // mode='contained'
                    color={colors.PHILIPPINE_ORANGE}
                    style={{ width: '100%', marginTop: 10 }}
                    labelStyle={{ fontSize: 13, textTransform: 'none' }}
                    disabled={loading}
                    onPress={() => setShowInfoModal(true)}
                >
                    Chưa có tài khoản?
                </Button>
            </View>
            <Portal>
                <Dialog visible={showInfoModal} onDismiss={() => setShowInfoModal(false)}>
                    <Dialog.Title>Yêu cầu lập tài khoản</Dialog.Title>
                    <Dialog.Content>
                        <Text>Vui lòng liên hệ chúng tôi để được cấp tài khoản đăng nhập:</Text>
                        <View style={{ marginTop: 5, marginBottom: 5 }}>
                            <Text style={styles.labelText}>Địa chỉ: <Text style={styles.infoText}>{constant.CONTACT_INFO.address}</Text></Text>
                            <Text style={styles.labelText}>Điện thoại: <Text style={styles.infoText}>{constant.CONTACT_INFO.phone}</Text></Text>
                            <Text style={styles.labelText}>Email: <Text style={styles.infoText}>{constant.CONTACT_INFO.email}</Text></Text>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowInfoModal(false)}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    },
    labelText: {
        color: colors.secondaryText,
        fontSize: 12
    },
    infoText: {
        color: colors.primaryText,
    }
});


export default LoginScreen;
