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
                    ...(data ? utility.makeupPower(data.curSumActPower) : undefined)
                },
                sub: {
                    text: 'Công suất danh định',
                    ...(data ? utility.makeupPower(data.ratedSumPower, 'p') : undefined)
                }
            }}/>
            <RowInfo info={{
                main: {
                    text: 'Tổng lượng điện PV trong ngày',
                    ...(data ? utility.makeupProduct(data.todaySumEnergy) : undefined)
                },
                sub: {
                    text: 'Tổng lượng điện PV tích lũy',
                    ...(data ? utility.makeupProduct(data.allSumEnergy) : undefined)
                }
            }}/>
        </>;
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

    const incomeDom = useMemo(() => {
        const data = overviewData?.site;
        let price = data?.price;
        const currency = data?.currency;

        price = price ? parseInt(price) : 0;
        price = isFinite(price) && !isNaN(price) && price > 0 ? price : 0;

        let value, unit, totalValue, totalUnit;
        if (data && price && currency) {
            let makeup = utility.makeupMoney(data.todaySumEnergy * price / 1000);
            value = makeup.value;
            unit = makeup.unit + ' ' + currency;

            makeup = utility.makeupMoney(data.allSumEnergy * price / 1000);
            totalValue = makeup.value;
            totalUnit = makeup.unit + ' ' + currency;
        }

        return <RowInfo info={{
            main: {
                text: 'Lợi nhuận trong ngày',
                ...(data ? {
                    value: value ? value : '',
                    unit: unit ? unit : 'chưa cài đặt'
                } : undefined)
            },
            sub: {
                text: 'Tổng lợi nhuận tích lũy',
                ...(data ? {
                    value: totalValue ? totalValue : '--',
                    unit: totalUnit ? totalUnit : ''
                } : undefined)
            }
        }}/>;
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
