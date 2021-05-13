import React, { useContext, useEffect, useMemo, useState } from 'react';
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

const UserAddSiteScreen = ({ route }) => {
    const serverContext = useContext(ServerContext);

    const user = useMemo(() => route?.params?.user, [route]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [selectSites, setSelectSites] = useState([]);

    // const addConfirmModal = useMemo(() => {
    //     const onAdd = () => {
    //         setError('');
    //         setLoading(true);
    //
    //         (async () => {
    //             try {
    //                 await serverContext.axios.post('/users/update-sites', {
    //                     id: user._id,
    //                     action: 'add',
    //                     sites: selectSites.map(s => s._id)
    //                 });
    //                 eventCenter.push(eventCenter.eventNames.updateDeleteUserSite, { id: showDeleteSite._id });
    //                 setShowDeleteSite(undefined);
    //             } catch (e) {
    //                 setError(serverError.getError(e));
    //             }
    //             setLoading(false);
    //         })();
    //     };
    //
    //     return <Portal>
    //         <Dialog visible={!!showDeleteSite} dismissable={!loading} onDismiss={() => setShowDeleteSite(undefined)}>
    //             <Dialog.Title>{showDeleteSite?.name}</Dialog.Title>
    //             <Dialog.Content>
    //                 <Text>Bạn có muốn xóa quyền truy cập của người dùng tới trạm này không?</Text>
    //                 {!!error && <HelperText type='error' visible={!!error}>
    //                     {error}
    //                 </HelperText>}
    //             </Dialog.Content>
    //             <Dialog.Actions>
    //                 <Button disabled={loading} onPress={() => setShowDeleteSite(undefined)} style={{ marginEnd: 15 }} labelStyle={{ color: colors.primaryText }}>Không</Button>
    //                 <Button disabled={loading} mode={'contained'} loading={loading} onPress={onDelete} style={{ backgroundColor: colors.PHILIPPINE_ORANGE }}>Có</Button>
    //             </Dialog.Actions>
    //         </Dialog>
    //     </Portal>;
    // }, [showDeleteSite, loading, error, user]);

    const onAddPress = () => {

    };

    const listSiteDom = useMemo(() => {
        if (!user) {
            return;
        }

        return <ListScroll
            renderItem={(item) => <UserSiteBadge item={item} isAddSite={selectSites.some(s => s._id === item._id)} onPress={() => {
                console.log(item);
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
            <View style={{ marginStart: 15, marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: colors.secondaryText, flex: 1 }}>Chọn trạm điện</Text>
                {!!selectSites?.length && <Button labelStyle={{ textTransform: 'none', color: colors.PHILIPPINE_ORANGE }} onPress={onAddPress}>{`Thêm (${selectSites.length})`}</Button>}
            </View>
            <View style={{ flex: 1 }}>
                {listSiteDom}
            </View>
        </View>
    </AppBarLayout>;
};

export default UserAddSiteScreen;
