import React, { useState, useContext, useMemo } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Avatar, Button, TextInput, HelperText } from 'react-native-paper';
import { colors } from '../common/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../context/userContext';
import constant from '../common/constant';
import ServerContext from '../context/serverContext';

const RegisterScreen = ({ navigation }) => {
    const userContext = useContext(UserContext);
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
        setLoading(true);

        // (async () => {
        //     try {
        //         const response = await serverContext.axios.post('/users/login', { email, password });
        //         await AsyncStorage.setItem(RememberKey, rememberPassword ? 'true' : '');
        //         await AsyncStorage.setItem(RememberIdKey, rememberPassword ? email : '');
        //         await AsyncStorage.setItem(RememberPasswordKey, rememberPassword ? password : '');
        //         userContext.updateToken(response.data.token, navigation);
        //     } catch (e) {
        //     }
        //
        //     setLoading(false);
        // })();

    };

    const themeInput = { colors: { primary: colors.PHILIPPINE_ORANGE, text: colors.primaryText, underlineColor: 'transparent' } };

    return <View style={styles.container}>
        <View style={{ alignItems: 'center', width: '100%' }}>
            <Avatar.Image size={240} source={require('../assets/picture/solar.jpg')} style={{ backgroundColor: 'white' }}/>
        </View>
        <TextInput
            theme={themeInput}
            mode={'outlined'}
            style={styles.textInput}
            dense={true}
            value={email}
            label={'Email đăng nhập*'}
            onChangeText={email => setEmail(email)}
            disabled={loading}
        />
        <HelperText type='error' visible={!!emailError}>
            {emailError}
        </HelperText>

        <TextInput
            theme={themeInput}
            mode={'outlined'}
            style={styles.textInput}
            value={password}
            label={'Mật khẩu*'}
            secureTextEntry={true}
            dense={true}
            onChangeText={text => setPassword(text)}
            disabled={loading}
        />
        <HelperText type='error' visible={!!passwordError}>
            {passwordError}
        </HelperText>

        <TextInput
            theme={themeInput}
            mode={'outlined'}
            style={styles.textInput}
            value={confirmPassword}
            label={'Mật khẩu xác nhận*'}
            secureTextEntry={true}
            dense={true}
            onChangeText={text => setConfirmPassword(text)}
            disabled={loading}
        />
        <HelperText type='error' visible={!!confirmError}>
            {confirmError}
        </HelperText>

        <TextInput
            theme={themeInput}
            mode={'outlined'}
            style={styles.textInput}
            dense={true}
            value={name}
            label={'Tên người dùng*'}
            onChangeText={name => setName(name)}
            disabled={loading}
        />
        <HelperText type='error' visible={!!nameError}>
            {nameError}
        </HelperText>

        <Button
            mode='contained'
            style={{ backgroundColor: colors.PHILIPPINE_ORANGE, width: '100%', marginTop: 5 }}
            disabled={loading || !canRegister}
            onPress={onRegisterClick}
        >
            Đăng Ký
        </Button>
        <Button
            color={colors.PHILIPPINE_ORANGE}
            style={{ width: '100%', marginTop: 10 }}
            labelStyle={{ fontSize: 13, textTransform: 'none' }}
            disabled={loading}
            onPress={() => navigation.goBack()}
        >
            Trờ về đăng nhập
        </Button>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingStart: 30,
        paddingEnd: 30,
        paddingBottom: '20%',
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
