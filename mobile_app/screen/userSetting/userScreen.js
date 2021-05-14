import React, { useContext, useMemo, useState } from 'react';
import AppBarLayout from '../../component/appBarLayout';
import { View } from 'react-native';
import FlatButton from '../../component/flatButton';
import utility from '../../common/utility';
import { Button, Dialog, HelperText, Portal, RadioButton, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ServerContext from '../../context/serverContext';
import serverError from '../../common/serverError';
import eventCenter from '../../common/eventCenter';
import ListScroll from '../../component/listScroll';
import UserSiteBadge from '../../component/listBadge/userSiteBadge';
import UserContext from '../../context/userContext';

const UserScreen = ({ navigation, route }) => {
    const userContext = useContext(UserContext);
    const serverContext = useContext(ServerContext);

    const [updatedUser, setUpdatedUser] = useState({});
    const user = useMemo(() => {
        if (route?.params?.user) {
            return { ...route?.params?.user, ...updatedUser };
        }
    }, [route, updatedUser]);

    const roleUser = useMemo(() => utility.USER_ROLES[Object.keys(utility.USER_ROLES).find(k => k === user?.role)], [user]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [selectRole, setSelectRole] = useState('');

    const [showChangeRole, setShowChangeRole] = useState(false);
    const [showDeleteSite, setShowDeleteSite] = useState(undefined);

    const changeRoleModal = useMemo(() => {
        const onChangeRole = () => {
            setLoading(true);
            setError('');

            (async () => {
                try {
                    const data = {
                        id: user._id,
                        role: selectRole
                    };
                    await serverContext.axios.post('/users/update-role', data);
                    eventCenter.push(eventCenter.eventNames.updateUserRole, data);
                    setUpdatedUser({ role: selectRole });
                    setShowChangeRole(false);
                } catch (e) {
                    setError(serverError.getError(e));
                }
                setLoading(false);
            })();
        };

        return <Portal>
            <Dialog visible={showChangeRole} dismissable={!loading} onDismiss={() => setShowChangeRole(false)}>
                <Dialog.Title>Đổi quyền người dùng</Dialog.Title>
                <Dialog.Content>
                    {Object.keys(utility.USER_ROLES).map(role => <View key={role} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton
                            disabled={loading}
                            color={colors.PHILIPPINE_ORANGE}
                            value={role}
                            status={selectRole === role ? 'checked' : 'unchecked'}
                            onPress={() => setSelectRole(role)}
                        />
                        <Text onPress={() => !loading && setSelectRole(role)}>{utility.USER_ROLES[role].label}</Text>
                    </View>)}
                    {!!error && <HelperText type='error' visible={!!error}>
                        {error}
                    </HelperText>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button disabled={loading} onPress={() => setShowChangeRole(false)} style={{ marginEnd: 15 }} labelStyle={{ color: colors.primaryText }}>Hủy</Button>
                    <Button disabled={loading || user.role === selectRole} mode={'contained'} loading={loading} onPress={onChangeRole} style={{ backgroundColor: colors.PHILIPPINE_ORANGE }}>Xong</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showChangeRole, loading, selectRole, error, user]);

    const deleteModalDom = useMemo(() => {
        const onDelete = () => {
            setError('');
            setLoading(true);

            (async () => {
                try {
                    await serverContext.axios.post('/users/update-sites', {
                        id: user._id,
                        action: 'remove',
                        sites: [showDeleteSite._id]
                    });
                    eventCenter.push(eventCenter.eventNames.updateDeleteUserSite, { id: showDeleteSite._id });
                    setShowDeleteSite(undefined);
                } catch (e) {
                    setError(serverError.getError(e));
                }
                setLoading(false);
            })();
        };

        return <Portal>
            <Dialog visible={!!showDeleteSite} dismissable={!loading} onDismiss={() => setShowDeleteSite(undefined)}>
                <Dialog.Title>{showDeleteSite?.name}</Dialog.Title>
                <Dialog.Content>
                    <Text>Bạn có muốn xóa quyền truy cập của người dùng tới trạm này không?</Text>
                    {!!error && <HelperText type='error' visible={!!error}>
                        {error}
                    </HelperText>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button disabled={loading} onPress={() => setShowDeleteSite(undefined)} style={{ marginEnd: 15 }} labelStyle={{ color: colors.primaryText }}>Không</Button>
                    <Button disabled={loading} mode={'contained'} loading={loading} onPress={onDelete} style={{ backgroundColor: colors.PHILIPPINE_ORANGE }}>Có</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [showDeleteSite, loading, error, user]);

    const onOpenChangeRole = () => {
        if (roleUser) {
            setError('');
            setShowChangeRole(true);
            setSelectRole(user?.role);
        }
    };

    const listSiteDom = useMemo(() => {
        if (!user) {
            return;
        }

        if (user.role === utility.USER_ROLES.SA.id) {
            return <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.DARK_SOULS, marginTop: 20 }}>Quản trị viên có quyền truy cập vào mọi dữ liệu</Text>
                <Text style={{ color: colors.DARK_SOULS }}>Không cần thêm trạn điện ở đây</Text>
            </View>;
        }

        return <ListScroll
            renderItem={(item) => <UserSiteBadge item={item} onPress={() => setShowDeleteSite(item)}/>}
            path={'sites'}
            url={`/users/get-sites?id=${encodeURIComponent(user._id)}&access=true`}
            emptyMessage={'Chưa có quyền truy cập trạm nào'}
            listEvents={[eventCenter.eventNames.updateDeleteUserSite, eventCenter.eventNames.updateAddUserSite]}
            onEventDataChange={(eventName, data, setData) => {
                if (eventName === eventCenter.eventNames.updateDeleteUserSite) {
                    setData(lastData => {
                        if (lastData?.length) {
                            return lastData.filter(d => d._id !== data.id);
                        }
                        return lastData;
                    });
                } else if (eventName === eventCenter.eventNames.updateAddUserSite) {
                    setData(lastData => {
                        if (data?.sites?.length) {
                            let newData = lastData ? [...lastData] : [];
                            data.sites.reverse().forEach(s => {
                                if (newData.every(d => d._id !== s._id)) {
                                    newData = [s, ...newData];
                                }
                            });
                            return newData;
                        }
                        return lastData;
                    });
                }
            }}
        />;
    }, [user]);

    return <AppBarLayout title={user?.email} subtitle={user?.name}>
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white', marginTop: 3 }}>
                <FlatButton
                    title={'Quyền'}
                    iconName={user && userContext && user._id !== userContext.id ? 'pencil' : ''}
                    onPress={user && userContext && user._id !== userContext.id ? onOpenChangeRole : undefined}
                    currentValue={<>
                        <MaterialCommunityIcons name={roleUser?.icon || 'account'} size={18} color={colors.primaryText}/>
                        <Text style={{ color: colors.primaryText, paddingStart: 10 }}>{roleUser?.label}</Text>
                    </>}/>
            </View>
            <View style={{ flex: 1, marginTop: 10 }}>
                <View style={{ marginStart: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, color: colors.secondaryText, flex: 1 }}>Danh sách trạm được cấp quyền</Text>
                    {user && user.role !== utility.USER_ROLES.SA.id && <Button
                        labelStyle={{ textTransform: 'none', color: colors.PHILIPPINE_ORANGE }}
                        onPress={() => navigation.navigate('userAddSite', { user })}>Thêm</Button>}
                </View>
                <View style={{ flex: 1 }}>
                    {listSiteDom}
                </View>
            </View>
        </View>
        {changeRoleModal}
        {deleteModalDom}
    </AppBarLayout>;
};

export default UserScreen;
