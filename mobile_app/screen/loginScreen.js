import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View, } from 'react-native';
import { Avatar, Button, TextInput, Checkbox, Text, HelperText, Portal, Dialog } from 'react-native-paper';
import { colors } from '../common/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../context/userContext';
import constant from '../common/constant';
import ServerContext from '../context/serverContext';
import * as Analytics from 'expo-firebase-analytics';

const RememberKey = 'RememberKey';
const RememberIdKey = 'RememberIdKey';
const RememberPasswordKey = 'RememberPasswordKey';

const LoginScreen = ({ navigation, route }) => {
    const passwordRef = useRef(null);

    const [showModal, setShowModal] = useState(route?.params?.created);

    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);

    const [email, setEmail] = useState(route?.params?.email || '');
    const [password, setPassword] = useState(route?.params?.password || '');
    const [rememberPassword, setRememberPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const emailError = useMemo(() => email && !constant.emailRegex.test(email) ? 'Email không hợp lệ' : '', [email]);
    const canLogin = useMemo(() => email && !emailError && password, [emailError, email, password]);

    useEffect(() => {
        (async () => {
            const isRemember = !!(await AsyncStorage.getItem(RememberKey)) || false;
            setRememberPassword(isRemember);

            if (isRemember) {
                try {
                    const email = await AsyncStorage.getItem(RememberIdKey) || '';
                    let password = await AsyncStorage.getItem(RememberPasswordKey) || '';
                    setEmail(email);
                    setPassword(password);
                } catch (e) {
                    // ignore
                }
            }

            setLoading(false);
        })();
    }, []);

    const onLoginClick = () => {
        if (loading || !canLogin) {
            return;
        }

        setLoading(true);

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
                userContext.updateToken(response.data.token, navigation);
            } catch (e) {
                setLoading(false);
            }
        })();

    };

    const themeInput = { colors: { primary: colors.PHILIPPINE_ORANGE, text: colors.primaryText, underlineColor: 'transparent' } };

    return <ScrollView style={styles.container}>
        <View style={{ alignItems: 'center', width: '100%', marginTop: 20 }}>
            <Avatar.Image size={240} source={require('../assets/picture/solar.jpg')} style={{ backgroundColor: 'white' }}/>
        </View>
        <TextInput
            theme={themeInput}
            mode={'outlined'}
            style={styles.textInput}
            dense={true}
            value={email}
            keyboardType={'email-address'}
            label={'Email đăng nhập'}
            textContentType={'emailAddress'}
            autoCapitalize={'none'}
            onChangeText={email => setEmail(email)}
            disabled={loading}
            returnKeyType={'next'}
            onSubmitEditing={() => passwordRef.current.focus()}
        />
        {!!emailError && <HelperText type='error'>
            {emailError}
        </HelperText>}

        <TextInput
            ref={passwordRef}
            theme={themeInput}
            mode={'outlined'}
            style={styles.textInput}
            value={password}
            label={'Mật khẩu'}
            secureTextEntry={true}
            dense={true}
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
            onPress={() => navigation.push('register')}
        >
            Đăng ký tài khoản
        </Button>
        <Portal>
            <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                <Dialog.Title>Thông báo</Dialog.Title>
                <Dialog.Content>
                    <Text>Bạn đã đăng ký tài khoản thành công</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowModal(false)}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    </ScrollView>;
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


export default LoginScreen;
