import React, { useMemo, useState } from 'react';
import AppBarLayout from '../component/appBarLayout';
import { View } from 'react-native';
import FlatButton from '../component/flatButton';
import utility from '../common/utility';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { colors } from '../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UserScreen = ({ route }) => {
    const user = useMemo(() => route?.params?.user, [route]);
    const roleUser = useMemo(() => utility.USER_ROLES[Object.keys(utility.USER_ROLES).find(k => k === user?.role)], [user]);
    const [showChangeRole, setShowChangeRole] = useState(false);
    const [loading, setLoading] = useState(false);

    const changeRoleModal = useMemo(() => {
        return <Portal>
            <Dialog visible={showChangeRole} onDismiss={() => setShowChangeRole(false)}>
                <Dialog.Title>Alert</Dialog.Title>
                <Dialog.Content>
                    <Text>This is simple dialog</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowChangeRole(false)}>Hủy</Button>
                    <Button onPress={() => setShowChangeRole(false)}>Xong</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showChangeRole, loading]);

    return <AppBarLayout title={user?.email} subtitle={user?.name}>
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white', marginTop: 3 }}>
                <FlatButton
                    title={'Quyền'}
                    iconName={'pencil'}
                    onPress={() => setShowChangeRole(true)}
                    currentValue={<>
                        <MaterialCommunityIcons name={roleUser?.icon || 'account'} size={18} color={colors.primaryText}/>
                        <Text style={{ color: colors.primaryText, paddingStart: 10 }}>{roleUser?.label}</Text>
                    </>}/>
            </View>
            <View style={{ flex: 1, marginStart: 15, marginTop: 10 }}>
                <Text style={{ fontSize: 15, color: colors.secondaryText }}>Trạm được cấp quyền</Text>
            </View>
        </View>
        {changeRoleModal}
    </AppBarLayout>;
};

export default UserScreen;
