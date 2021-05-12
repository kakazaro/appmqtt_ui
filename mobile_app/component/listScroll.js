import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, VirtualizedList } from 'react-native';
import ServerContext from '../context/serverContext';
import { Text } from 'react-native-paper';
import { colors } from '../common/themes';
import eventCenter from '../common/eventCenter';
import serverError from '../common/serverError';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ListScroll = ({ Component, url, path, showPlaceholder }) => {
    const serverContext = useContext(ServerContext);
    const [loading, setLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [pageToken, setPageToken] = useState('');
    const [data, setData] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        const handler = (data) => {
            if (path === 'sites' && url === '/site/list') {
                setData(lastData => {
                    if (lastData?.length) {
                        const newData = lastData.map(d => {
                            if (d.id === data.id) {
                                d.newId = d.id + (Math.floor(Math.random() * 10000000) + '');
                                d.name = data.name;
                            }
                            return d;
                        });
                        return [...newData];
                    }
                    return lastData;
                });
            }
        };

        eventCenter.register(eventCenter.eventNames.updateSiteName, handler);

        return () => {
            eventCenter.unRegister(eventCenter.eventNames.updateSiteName, handler);
        };
    }, [url, path]);

    const loadData = async (nextPageToken = '', limit = 15) => {
        try {
            const response = await serverContext.axios.get(url + (url.includes('?') ? '&' : '?') + `limit=${limit}&nextPageToken=${encodeURIComponent(nextPageToken)}`);
            return {
                data: (response.data && response.data[path]) || [],
                nextPageToken: (response.data.nextPageToken || '') + ''
            };
        } catch (e) {
            console.log(e?.response)
            return {
                error: serverError.getError(e)
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
                        setError(result.error);

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
    }, [loadingMore, pageToken, loading]);

    const onLoadMore = () => {
        setTimeout(() => setLoadingMore(true), 10);
    };

    useEffect(() => {
        onReload();
    }, [serverContext]);

    const footer = useMemo(() => {
        if (loading && showPlaceholder) {
            return <>{Array(loadingMore ? 1 : 15).fill('').map((i, index) => <Component key={index}/>)}</>;
        }
    }, [showPlaceholder, loading, loadingMore, Component]);

    const listDom = useMemo(() => <VirtualizedList
        data={data || []}
        renderItem={({ item }) => <Component item={item}/>}
        keyExtractor={(item, index) => item?.newId || item?.id || item?._id || (index + '')}
        getItem={(data, index) => data[index]}
        getItemCount={(data) => data?.length || 0}
        onRefresh={onReload}
        onEndReached={onLoadMore}
        refreshing={loading}
        ListFooterComponent={footer}
        ListEmptyComponent={<>
            {!loading && data && <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                <MaterialCommunityIcons name={!error ? 'briefcase-search-outline' : 'alert-octagon-outline'} size={38} color={colors.DARK_SOULS}/>
                <Text style={{ color: colors.DARK_SOULS }}>{!error ? 'Chưa có dữ liệu' : (error || 'Đã có lỗi xả ra khi tải dữ liệu')}</Text>
            </View>}
        </>}
    />, [data, Component, loading, footer, error]);

    return <View style={{ flex: 1, width: '100%' }}>
        {listDom}
    </View>;
};

export default ListScroll;
