import React, { useContext, useMemo, useState } from 'react';
import AppBarLayout from '../../component/appBarLayout';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import ServerContext from '../../context/serverContext';
import serverError from '../../common/serverError';
import eventCenter from '../../common/eventCenter';
import ListScroll from '../../component/listScroll';
import UserSiteBadge from '../../component/listBadge/userSiteBadge';
import ConfirmDialog from '../../component/confirmDialog';

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
                    await serverContext.post('/users/update-sites', {
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

        return <ConfirmDialog
            show={show}
            dismissible={!loading}
            loading={loading}
            title={'Xác nhận'}
            content={`Bạn có muốn thêm quyền truy cập cho ${selectSites.length} trạm này không?`}
            error={error}
            isNegative={false}
            onClose={() => setShow(false)}
            onOk={onAdd}
        />;
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
