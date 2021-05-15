import React, { useContext, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, List, Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../common/themes';
import FlatButton from '../../component/flatButton';
import CustomInput from '../../component/customInput';
import ServerContext from '../../context/serverContext';
import AppBarLayout from '../../component/appBarLayout';
import serverError from '../../common/serverError';

const LANGUAGE = [
    {
        title: 'Tiếng Việt',
    },
    {
        title: 'English',
        description: 'coming soon',
        disabled: true
    }
];


const HomeSettingScreen = ({ navigation }) => {
    const serverContext = useContext(ServerContext);

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const [loading, setLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const passwordRef = useRef();
    const [password, setPassword] = useState('');
    const passwordConfirmRef = useRef();
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [error, setError] = useState('');

    const appSetting = useMemo(() => ([
        {
            title: 'Thông tin ứng dụng',
            onPress: () => navigation.navigate('about')
        },
        {
            title: 'Đổi mật khẩu',
            onPress: () => setShowChangePasswordModal(true)
        }
    ]), [navigation]);

    const changePasswordDom = useMemo(() => {
        const passwordError = password && (password.length < 6 || password.length > 52) ? 'Mật khẩu phải từ 6 đến 52 ký tự' : '';
        const confirmError = passwordConfirm && !passwordError && passwordConfirm !== password ? 'Mật khẩu xác nhận không khớp' : '';
        const canChange = oldPassword && password && !passwordError && !confirmError;

        const onChangePasswordRequest = () => {
            setLoading(true);
            setError('');
            (async () => {
                try {
                    await serverContext.axios.post('/users/change-password', {
                        'oldPassword': oldPassword,
                        'newPassword': password
                    });
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'login', params: { changedPassword: true } }],
                    });
                } catch (e) {
                    setError(serverError.getError(e));
                    setLoading(false);
                }
            })();
        };

        return <Portal>
            <Dialog visible={showChangePasswordModal} dismissable={!loading} onDismiss={() => setShowChangePasswordModal(false)}>
                <Dialog.Title>Đổi mật khẩu đăng nhập</Dialog.Title>
                <Dialog.Content>
                    <CustomInput
                        style={styles.textInput}
                        value={oldPassword}
                        label={'Mật khẩu cũ'}
                        secureTextEntry={true}
                        onChangeText={password => setOldPassword(password)}
                        textContentType={'password'}
                        disabled={loading}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        returnKeyType={'next'}
                        isDialog={true}
                    />

                    <CustomInput
                        ref={passwordRef}
                        style={styles.textInput}
                        value={password}
                        label={'Mật khẩu mới'}
                        secureTextEntry={true}
                        onChangeText={password => setPassword(password)}
                        textContentType={'password'}
                        disabled={loading}
                        onSubmitEditing={() => passwordConfirmRef.current.focus()}
                        returnKeyType={'next'}
                        error={passwordError}
                        isDialog={true}
                    />

                    <CustomInput
                        ref={passwordConfirmRef}
                        style={styles.textInput}
                        value={passwordConfirm}
                        label={'Mật khẩu xác nhận'}
                        secureTextEntry={true}
                        onChangeText={password => setPasswordConfirm(password)}
                        textContentType={'password'}
                        disabled={loading}
                        onSubmitEditing={onChangePasswordRequest}
                        returnKeyType={'done'}
                        error={confirmError}
                        isDialog={true}
                    />

                    {!!error && <HelperText type='error'>
                        {error}
                    </HelperText>}

                </Dialog.Content>
                <Dialog.Actions>
                    <Button style={{ minWidth: 70 }} labelStyle={{ color: colors.primaryText }} disabled={loading} onPress={() => setShowChangePasswordModal(false)}>Hủy</Button>
                    <Button style={{ marginStart: 10, minWidth: 70, backgroundColor: colors.PHILIPPINE_ORANGE }} onPress={onChangePasswordRequest} disabled={!canChange || loading} loading={loading} mode='contained'>Đổi</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showChangePasswordModal, password, passwordConfirm, loading, oldPassword, navigation, serverContext, error]);

    return <AppBarLayout title={'Cài đặt'}>
        <ScrollView>
            <View style={{ marginTop: 10, backgroundColor: 'white' }}>
                <List.AccordionGroup>
                    <List.Accordion title='Ngôn ngữ' id='1' titleStyle={{ fontSize: 15, color: colors.primaryText }} right={({ isExpanded }) => <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: colors.secondaryText }}>{LANGUAGE[0].title}</Text>
                        <MaterialCommunityIcons name={!isExpanded ? 'chevron-down' : 'chevron-up'} size={24} color={colors.primaryText} style={{ marginStart: 10 }}/>
                    </View>}>
                        {LANGUAGE.map((lang, index) => <List.Item
                            key={index}
                            title={lang.title}
                            right={() => <>{!lang.disabled && <MaterialCommunityIcons name={'check-circle'} size={20} color={colors.PHILIPPINE_ORANGE} style={{ marginEnd: 20 }}/>}</>}
                            description={lang.description}
                            style={{ marginStart: 10, borderTopStyle: 'solid', borderTopWidth: 1, borderTopColor: colors.UNICORN_SILVER }}
                            titleStyle={{ fontSize: 13, color: lang.disabled ? colors.DARK_SOULS : colors.primaryText }}
                            descriptionStyle={{ fontSize: 11 }}
                        />)}
                    </List.Accordion>
                </List.AccordionGroup>
            </View>
            <View style={{ marginTop: 10, backgroundColor: 'white' }}>
                {appSetting.map((setting, index) => <FlatButton
                    iconName={'chevron-right'}
                    key={index}
                    title={setting.title}
                    style={{ borderTopStyle: 'solid', borderTopWidth: index ? 1 : 0, borderTopColor: colors.UNICORN_SILVER }}
                    onPress={setting.onPress}
                />)}
            </View>
            {changePasswordDom}
        </ScrollView>
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

export default HomeSettingScreen;
