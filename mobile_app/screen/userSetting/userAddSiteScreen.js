import React, { useContext, useMemo, useState } from 'react';
import AppBarLayout from '../../component/appBarLayout';
import { View } from 'react-native';
import { Button, Dialog, HelperText, Portal, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import ServerContext from '../../context/serverContext';
import serverError from '../../common/serverError';
import eventCenter from '../../common/eventCenter';
import ListScroll from '../../component/listScroll';
import UserSiteBadge from '../../component/listBadge/userSiteBadge';

const UserAddSiteScreen = ({ navigation, route }) => {
    const serverContext = useContext(ServerContext);

    const user = useMemo(() => route?.params?.user, [route]);

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [selectSites, setSelectSites] = useState([]);

    const addConfirmModal = useMemo(() => {
        const onAdd = () => {
            setError('');
            setLoading(true);

            (async () => {
                try {
                    await serverContext.axios.post('/users/update-sites', {
                        id: user._id,
                        action: 'add',
                        sites: selectSites.map(s => s._id)
                    });
                    eventCenter.push(eventCenter.eventNames.updateAddUserSite, { sites: [...selectSites] });
                    navigation.goBack();
                } catch (e) {
                    console.log(e);
                    setError(serverError.getError(e));
                }
                setLoading(false);
            })();
        };

        return <Portal>
            <Dialog visible={show} dismissable={!loading} onDismiss={() => setShow(false)}>
                <Dialog.Title>Xác nhận</Dialog.Title>
                <Dialog.Content>
                    <Text>{`Bạn có muốn thêm quyền truy cập cho ${selectSites.length} trạm này không?`}</Text>
                    {!!error && <HelperText type='error' visible={!!error}>
                        {error}
                    </HelperText>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button disabled={loading} onPress={() => setShow(false)} style={{ marginEnd: 15 }} labelStyle={{ color: colors.primaryText }}>Không</Button>
                    <Button disabled={loading} mode={'contained'} loading={loading} onPress={onAdd} style={{ backgroundColor: colors.PHILIPPINE_ORANGE, minWidth: 60 }}>Có</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;
    }, [show, loading, error, user, selectSites]);

    const listSiteDom = useMemo(() => {
        if (!user) {
            return;
        }

        return <ListScroll
            renderItem={(item) => <UserSiteBadge item={item} isAddSite={selectSites.some(s => s._id === item._id)} onPress={() => {
                if (selectSites.some(s => s._id === item._id)) {
                    setSelectSites(selectSites.filter(s => s._id !== item._id));
                } else {
                    setSelectSites([...selectSites, item]);
                }
            }}/>}
            path={'sites'}
            url={`/users/get-sites?id=${encodeURIComponent(user._id)}&access=false`}
            emptyMessage={'Không có trạm nào để thêm'}
            listEvents={[eventCenter.eventNames.updateAddUserSite]}
            onEventDataChange={(eventName, data, setData) => {
                if (eventName === eventCenter.eventNames.updateAddUserSite) {
                    setData(lastData => {
                        if (lastData?.length) {
                            return lastData.filter(d => d._id !== data.id);
                        }
                        return lastData;
                    });
                }
            }}
            onRefreshCallback={() => setSelectSites([])}
        />;
    }, [user, selectSites]);

    return <AppBarLayout title={'Thêm trạm'}>
        <View style={{ flex: 1 }}>
            <View style={{ marginStart: 15, marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: colors.secondaryText, flex: 1 }}>Các trạm điện</Text>
                <Button
                    disabled={!selectSites?.length}
                    mode={'contained'}
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE, marginEnd: 15 }}
                    labelStyle={{ textTransform: 'none', fontSize: 13 }}
                    onPress={() => setShow(true)}
                >
                    {`Thêm (${selectSites.length})`}
                </Button>
            </View>
            <View style={{ flex: 1 }}>
                {listSiteDom}
            </View>
        </View>
        {addConfirmModal}
    </AppBarLayout>;
};

export default UserAddSiteScreen;
