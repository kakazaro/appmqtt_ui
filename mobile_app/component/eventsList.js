import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ServerContext from '../context/serverContext';
import serverError from '../common/serverError';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import EventBadge, { EventBadgePlaceholder } from './listBadge/eventBadge';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';
import moment from 'moment';

const EventsList = ({ siteId, deviceId }) => {
    const serverContext = useContext(ServerContext);
    const listRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [data, setData] = useState();
    const [nextPageToken, setNextPageToken] = useState();
    const [error, setError] = useState();

    const loadData = async (nextPageToken = '', limit = 20) => {
        try {
            const response = await serverContext.get(`event?limit=${limit}`
                + (nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : '')
                + (siteId ? `&site_id=${encodeURIComponent(siteId)}` : '')
                + (deviceId ? `&device_id=${encodeURIComponent(deviceId)}` : '')
            );
            return {
                data: (response.data && response.data.events) || [],
                nextPageToken: (response.data.nextPageToken || '') + ''
            };
        } catch (e) {
            console.log(e?.response);
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
                setNextPageToken(undefined);
                setError(false);
                (async () => {
                    const result = await loadData();
                    if (!discard) {
                        setData(result?.data || []);
                        setNextPageToken(result?.nextPageToken);
                        setError(result?.error);

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

    useEffect(() => {
        onReload();
    }, [serverContext]);

    const onReload = () => {
        setRefreshing(true);
    };

    useEffect(() => {
        let discard = false;

        if (loadingMore) {
            if (!loading && nextPageToken) {
                setLoading(true);
                (async () => {
                    const result = await loadData(nextPageToken);
                    setData((preData) => {
                        if (result.error) {
                            return [];
                        }

                        return preData.concat(result.data || []);
                    });
                    setNextPageToken(!result.error ? result.nextPageToken : '');
                    setError(!!result.error);

                    setLoadingMore(false);
                    setLoading(false);
                })();
            }
        }

        return () => {
            discard = true;
        };
    }, [loadingMore, nextPageToken, loading]);

    const onLoadMore = () => {
        setLoadingMore(true);
    };

    const footer = useMemo(() => {
        if (loading) {
            return <>{Array(loadingMore ? 1 : 10).fill('').map((i, index) => <React.Fragment key={index}><EventBadgePlaceholder/></React.Fragment>)}</>;
        }
    }, [loading, loadingMore]);

    const sections = useMemo(() => {
        if (data?.length) {
            const sections = [];
            let currentSection;
            for (let i = 0; i < data.length; i++) {
                const event = data[i];
                const date = moment(event.completed_at || event.timestamp).format('YYYY-MM-DD');
                // const date = moment(event.completed_at || event.timestamp).format('YYYY-MM-DD HH:mm');
                if (date && (!currentSection || currentSection.title !== date)) {
                    currentSection = {
                        index: sections.length,
                        title: date,
                        data: [event]
                    };
                    sections.push(currentSection);
                } else if (date && currentSection && currentSection.title === date) {
                    currentSection.data.push(event);
                }
            }

            return sections;
        }

        return [];
    }, [data]);

    const onHeaderClick = (index) => {
        if (listRef?.current) {
            listRef.current.scrollToLocation({
                itemIndex: 0, sectionIndex: index
            });
        }
    };

    return <View style={{ flex: 1, width: '100%', backgroundColor: data?.length ? 'white' : undefined }}>
        <SectionList
            ref={listRef}
            sections={sections}
            keyExtractor={(item, index) => item?.newId || item?.id || item?._id || (index + '')}
            renderItem={({ item }) => <EventBadge item={item} showSite={!siteId} showDevice={!deviceId}/>}
            renderSectionHeader={({ section: { title, index } }) => <View style={{ width: '100%', flexDirection: 'row', marginVertical: 5 }}>
                <View style={{ flex: 1 }}/>
                <TouchableOpacity style={{ flex: 0 }} onPress={() => onHeaderClick(index)}>
                    <Text style={{ flex: 0, backgroundColor: colors.UNICORN_SILVER, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }}>{title}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}/>
            </View>}
            initialNumToRender={10}
            onEndReachedThreshold={0.1}
            stickySectionHeadersEnabled={true}
            stickyHeaderIndices={[5]}
            onRefresh={onReload}
            onEndReached={onLoadMore}
            refreshing={loading}
            ListFooterComponent={footer}
            ListEmptyComponent={<>
                {!loading && data && <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                    <View style={{ maxWidth: '75%', alignItems: 'center' }}>
                        <MaterialCommunityIcons name={!error ? 'briefcase-search-outline' : 'alert-octagon-outline'} size={38} color={colors.DARK_SOULS}/>
                        <Text style={{ color: colors.DARK_SOULS, textAlign: 'center' }}>{!error ? 'Chưa có dữ liệu' : (error || 'Đã có lỗi xả ra khi tải dữ liệu')}</Text>
                    </View>
                </View>}
            </>}
        />
    </View>;
};

export default EventsList;
