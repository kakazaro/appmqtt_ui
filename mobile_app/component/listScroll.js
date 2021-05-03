import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, VirtualizedList } from 'react-native';
import ServerContext from '../context/serverContext';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';

const ListScroll = ({ Component, url, path, showPlaceholder }) => {
    const serverContext = useContext(ServerContext);
    const [loading, setLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);


    const [pageToken, setPageToken] = useState('');
    const [data, setData] = useState();
    const [error, setError] = useState(false);


    const loadData = async (nextPageToken = '', limit = 15) => {
        try {
            const response = await serverContext.axios.get(url + (url.includes('?') ? '&' : '?') + `limit=${limit}&nextPageToken=${encodeURIComponent(nextPageToken)}`);
            return {
                data: (response.data && response.data[path]) || [],
                nextPageToken: (response.data.nextPageToken || '') + ''
            };
        } catch (e) {
            return {
                error: true
            };
        }
    };

    useEffect(() => {
        let discard = false;
        if (refreshing) {
            if (!loading) {
                setLoading(true);
                setError(false);
                (async () => {
                    const result = await loadData();
                    if (!discard) {
                        setData(!result.error ? result.data : []);
                        setPageToken(!result.error ? result.nextPageToken : '');
                        setError(!!result.error);

                        setLoading(false);
                        setRefreshing(false);
                    }
                })();
            }
        }

        return () => {
            discard = true;
        };
    }, [refreshing]);

    const onReload = () => {
        setRefreshing(true);
    };

    useEffect(() => {
        let discard = false;

        if (loadingMore) {
            if (!loading && pageToken) {
                setLoading(true);
                (async () => {
                    const result = await loadData(pageToken);
                    setData((preData) => !result.error ? preData.concat(result.data || []) : []);
                    setPageToken(!result.error ? result.nextPageToken : '');
                    setError(!!result.error);

                    setLoading(false);
                    setLoadingMore(false);
                })();
            }
        }

        return () => {
            discard = true;
        };
    }, [loadingMore]);

    const onLoadMore = () => {
        setLoadingMore(true);
    };

    useEffect(() => {
        onReload();
    }, [serverContext]);

    const footer = useMemo(() => {
        if (loading && showPlaceholder) {
            return <>{Array(15).fill('').map((i, index) => <Component key={index}/>)}</>;
        }
    }, [showPlaceholder, loading, Component]);

    return <View style={{ flex: 1, width: '100%' }}>
        <VirtualizedList
            data={data || []}
            renderItem={({ item }) => <Component item={item}/>}
            keyExtractor={(item, index) => item?.id || item?._id || (index + '')}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data?.length || 0}
            onRefresh={onReload}
            onEndReached={onLoadMore}
            refreshing={loading}
            ListFooterComponent={footer}
            ListEmptyComponent={<>
                {!loading && data && <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                    <MaterialCommunityIcons name={!error ? 'help-network-outline' : 'weather-cloudy-alert'} size={100} color={colors.DARK_SOULS}/>
                    <Text style={{ color: colors.DARK_SOULS, marginTop: 20 }}>{!error ? 'Hiện chưa có Data để hiển thị' : 'Đã có lỗi xả ra khi tải dữ liệu'}</Text>
                    <Button labelStyle={{ color: colors.FADING_NIGHT, fontSize: 13, textTransform: 'none' }} onPress={onReload}>Thử lại</Button>
                </View>}
            </>}
        />
    </View>;
};

export default ListScroll;
