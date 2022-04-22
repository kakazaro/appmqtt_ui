import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import utility from '../../../common/utility';
import ServerContext from '../../../context/serverContext';
import SimpleChar, { ENUM_SOURCE } from '../../../component/chart/simpleChart';
import SiteContext from '../../../context/siteContext';
import { useFocusEffect } from '@react-navigation/native';
import eventCenter from '../../../common/eventCenter';
import StatusBanner from '../../../component/statusBanner';
import RowInfo from '../../../component/rowInfo/rowInfo';

const SiteOverviewTab = () => {
    const serviceContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const site = useMemo(() => siteContext?.site, [siteContext]);
    const siteId = useMemo(() => site?.id, [site]);

    const [overviewData, setOverviewData] = useState();
    const [overviewDataError, setOverviewDataError] = useState();

    useEffect(() => {
        const handler = (eventName, data) => {
            setOverviewData(overviewData => {
                if (overviewData?.site && siteId === data.id) {
                    return {
                        ...overviewData,
                        site: {
                            ...overviewData.site,
                            price: data.price,
                            currency: data.currency
                        }
                    };
                }
                return overviewData;
            });
        };
        eventCenter.register(eventCenter.eventNames.updateSitePrice, handler);

        return () => {
            eventCenter.unRegister(eventCenter.eventNames.updateSitePrice, handler);
        };
    }, [siteId]);

    useFocusEffect(React.useCallback(() => {
        if (siteId) {
            const uid = serviceContext.dataControl.registerSiteData({
                url: 'site/overview?id=' + encodeURIComponent(siteId),
                handler: setOverviewData,
                handlerError: setOverviewDataError,
                duration: 10000
            });

            return () => {
                serviceContext.dataControl.unRegisterSiteData(uid);
            };
        }
    }, [siteId, serviceContext]));

    const infoDom = useMemo(() => {
        const data = overviewData?.site;

        return <>
            <RowInfo info={{
                main: {
                    text: 'Công suất PV hiện tại',
                    ...(data ? utility.makeupPower(data.curSumActPower) : {})
                },
                sub: {
                    text: 'Công suất danh định',
                    ...(data ? utility.makeupPower(data.ratedSumPower, 'p') : {})
                }
            }}/>
            <RowInfo info={{
                main: {
                    text: 'Tổng lượng điện PV trong ngày',
                    ...(data ? utility.makeupProduct((data['kwh_total'] || 0) * 1000) : {})
                },
                details: [
                    {
                        text: 'Khung giờ cao điểm',
                        ...(data ? utility.makeupProduct((data['kwh_cd'] || 0) * 1000) : {})
                    },
                    {
                        text: 'Khung giờ bình thường',
                        ...(data ? utility.makeupProduct((data['kwh_bt'] || 0) * 1000) : {})
                    },
                    {
                        text: 'Khung giờ thấp điểm',
                        ...(data ? utility.makeupProduct((data['kwh_td'] || 0) * 1000) : {})
                    },
                    {
                        text: 'TỔNG',
                        isSum: true,
                        ...(data ? utility.makeupProduct((data['kwh_total'] || 0) * 1000) : {})
                    }
                ],
                sub: {
                    text: 'Tổng lượng điện PV tích lũy',
                    ...(data ? utility.makeupProduct((data['kwh_sum'] || 0) * 1000) : {})
                }
            }}/>
        </>;
    }, [overviewData]);

    const incomeDom = useMemo(() => {
        const data = overviewData?.site;
        const currency = data?.currency;

        return <RowInfo info={{
            main: {
                text: 'Lợi nhuận trong ngày',
                ...(data ? utility.makeupMoney(data['total_price'], currency) : {})
            },
            details: [
                {
                    text: 'Khung giờ cao điểm',
                    ...(data ? utility.makeupMoney(data['price_cd'], currency) : {})
                },
                {
                    text: 'Khung giờ bình thường',
                    ...(data ? utility.makeupMoney(data['price_bt'], currency) : {})
                },
                {
                    text: 'Khung giờ thấp điểm',
                    ...(data ? utility.makeupMoney(data['price_td'], currency) : {})
                },
                {
                    text: 'TỔNG',
                    isSum: true,
                    ...(data ? utility.makeupMoney(data['total_price'], currency) : {})
                }
            ],
            sub: {
                text: 'Tổng lợi nhuận tích lũy',
                ...(data ? utility.makeupMoney(data['price_sum'], currency) : {})
            }
        }}/>;
    }, [overviewData]);

    const consumeDom = useMemo(() => {
        const data = overviewData?.site;

        return <>
            <RowInfo info={{
                main: {
                    text: 'Tổng điện năng tiêu thụ trong ngày',
                    ...(data ? utility.makeupProduct(data.comsumeEnergy || data.consumeEnergy) : undefined)
                }
            }}/>
        </>;
    }, [overviewData]);

    const chartDom = useMemo(() => siteId ? <SimpleChar source={ENUM_SOURCE.site} id={siteId}/> : <></>, [siteId]);

    return <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
            <StatusBanner statusId={overviewData?.site?.status || site?.status} title={'Trạng thái'}/>
            {!!overviewDataError && <HelperText style={{ marginStart: 5 }} type={'error'} visible={true}>Lỗi: {overviewDataError}</HelperText>}
            {infoDom}
            {incomeDom}
            {consumeDom}
            {chartDom}
        </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
    }
});

export default SiteOverviewTab;
