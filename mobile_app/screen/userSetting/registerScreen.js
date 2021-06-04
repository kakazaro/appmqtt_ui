import React, { useState, useContext, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, View, } from 'react-native';
import { Avatar, Button, HelperText } from 'react-native-paper';
import { colors } from '../../common/themes';
import constant from '../../common/constant';
import ServerContext from '../../context/serverContext';
import CustomInput from '../../component/customInput';
import AppBarLayout from '../../component/appBarLayout';
import serverError from '../../common/serverError';
import eventCenter from '../../common/eventCenter';
import utility from '../../common/utility';

const RegisterScreen = ({ navigation }) => {
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const nameRef = useRef(null);

    const serverContext = useContext(ServerContext);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emailError = useMemo(() => email && !constant.emailRegex.test(email) ? 'Email không hợp lệ' : '', [email]);
    const passwordError = useMemo(() => password && (password.length < 6 || password.length > 52) ? 'Mật khẩu phải từ 6 đến 52 ký tự' : '', [password]);
    const confirmError = useMemo(() => confirmPassword && !passwordError && confirmPassword !== password ? 'Mật khẩu xác nhận không khớp' : '', [passwordError, password, confirmPassword]);
    const nameError = useMemo(() => name && (name.length < 4 || name.length > 24) ? 'Tên người dùng không hợp lệ (4-24 ký tự)' : '', [name]);

    const canRegister = useMemo(() => email && !emailError && password && !passwordError && confirmPassword && !confirmError && name && !nameError, [emailError, passwordError, confirmError, nameError, email, password, confirmPassword, name]);

    const onRegisterClick = () => {
        if (loading || !canRegister) {
            return;
        }

        setLoading(true);
        setError('');
        (async () => {
            try {
                const response = await serverContext.axios.post('/users/create', { email: email.toLowerCase(), password, name });
                if (response.data?.user) {
                    const user = {
                        _id: response.data.user.id || 'newId_' + Math.floor(Math.random() * 10000000),
                        email: email.toLowerCase(),
                        role: utility.USER_ROLES.US.id,
                        name,
                        ...response.data.user
                    };
                    eventCenter.push(eventCenter.eventNames.addNewUser, user);
                    navigation.replace('user', { user });
                }

            } catch (err) {
                console.log(err);
                setError(serverError.getError(err));
                setLoading(false);
            }
        })();
    };

    return <AppBarLayout title={'Tạo Người Dùng Mới'}>
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
                <Avatar.Icon size={75} icon='account-plus' color={'white'} style={{ backgroundColor: colors.PHILIPPINE_ORANGE }}/>
            </View>
            <View style={{ width: '90%' }}>
                <CustomInput
                    style={styles.textInput}
                    value={email}
                    label={'Email đăng nhập*'}
                    onChangeText={email => setEmail(email)}
                    keyboardType={'email-address'}
                    textContentType={'emailAddress'}
                    autoCapitalize={'none'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    error={emailError}
                />

                <CustomInput
                    ref={passwordRef}
                    style={styles.textInput}
                    value={password}
                    label={'Mật khẩu*'}
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    textContentType={'password'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => passwordConfirmRef.current.focus()}
                    error={passwordError}
                />

                <CustomInput
                    ref={passwordConfirmRef}
                    style={styles.textInput}
                    value={confirmPassword}
                    label={'Mật khẩu xác nhận*'}
                    secureTextEntry={true}
                    onChangeText={text => setConfirmPassword(text)}
                    textContentType={'password'}
                    disabled={loading}
                    returnKeyType={'next'}
                    onSubmitEditing={() => nameRef.current.focus()}
                    error={confirmError}
                />

                <CustomInput
                    ref={nameRef}
                    style={styles.textInput}
                    value={name}
                    label={'Tên người dùng*'}
                    onChangeText={name => setName(name)}
                    textContentType={'name'}
                    disabled={loading}
                    returnKeyType={'done'}
                    onSubmitEditing={onRegisterClick}
                    error={nameError}
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
                    Tạo Tài Khoản
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


export default RegisterScreen;
