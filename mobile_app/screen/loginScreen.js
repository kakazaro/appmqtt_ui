import React, { useState, useEffect, useContext, useMemo } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Avatar, Button, TextInput, Checkbox, Text, HelperText } from 'react-native-paper';
import { colors } from '../common/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../context/userContext';
import constant from '../common/constant';
import ServerContext from '../context/serverContext';

const RememberKey = 'RememberKey';
const RememberIdKey = 'RememberIdKey';
const RememberPasswordKey = 'RememberPasswordKey';

const LoginScreen = ({ navigation }) => {
    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        setLoading(true);

        (async () => {
            try {
                const response = await serverContext.axios.post('/users/login', { email, password });
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
            label={'Email đăng nhập'}
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
            label={'Mật khẩu'}
            secureTextEntry={true}
            dense={true}
            onChangeText={password => setPassword(password)}
            disabled={loading}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 20, marginLeft: -10 }}>
            <Checkbox
                style={{ paddingStart: '0' }}
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


export default LoginScreen;
