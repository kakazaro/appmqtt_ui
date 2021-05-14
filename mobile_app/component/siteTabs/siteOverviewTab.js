import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, HelperText, Text } from 'react-native-paper';
import utility from '../../common/utility';
import { colors } from '../../common/themes';
import ServerContext from '../../context/serverContext';
import { Placeholder, PlaceholderLine, ShineOverlay } from 'rn-placeholder';
import SimpleChar from '../chart/simpleChart';
import SiteContext from '../../context/siteContext';
import { useFocusEffect } from '@react-navigation/native';
import eventCenter from '../../common/eventCenter';
import StatusBanner from '../statusBanner';

const OverviewInfo = ({ info }) => {
    return <View style={{ backgroundColor: 'white', width: '100%', marginTop: 5, paddingTop: 10, paddingBottom: 5, paddingStart: 15, paddingEnd: 15 }}>
        <View style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 14, color: colors.primaryText }}>
                {info.main.text}
            </Text>
            {info.main.value === undefined ?
                <Placeholder Animation={ShineOverlay}>
                    <PlaceholderLine width={30} height={30} noMargin={true} style={{ marginStart: '70%' }}/>
                </Placeholder>
                :
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                    <Text style={{ fontSize: 22, color: colors.primaryText }}>{info.main.value}</Text>
                    <Text style={{ fontSize: 15, color: colors.primaryText, marginStart: 3 }}>{info.main.unit}</Text>
                </View>}
        </View>
        <Divider/>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View>
                <Text style={{ fontSize: 13, color: colors.secondaryText }}>
                    {info.sub.text}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                {info.sub.value === undefined ?
                    <Placeholder Animation={ShineOverlay}>
                        <PlaceholderLine width={20} height={15} noMargin={true} style={{ marginStart: '80%' }}/>
                    </Placeholder>
                    :
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                        <Text style={{ color: colors.secondaryText }}>{info.sub.value}</Text>
                        <Text style={{ color: colors.secondaryText, paddingStart: 3 }}>{info.sub.unit}</Text>
                    </View>}
            </View>
        </View>
    </View>;
};

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
            <OverviewInfo info={{
                main: {
                    text: 'Công xuất hiện tại',
                    ...(data ? utility.makeupPower(data.curSumActPower) : undefined)
                },
                sub: {
                    text: 'Công xuất danh định',
                    ...(data ? utility.makeupPower(data.ratedSumPower, 'p') : undefined)
                }
            }}/>
            <OverviewInfo info={{
                main: {
                    text: 'Tổng Sản lượng điện trong ngày',
                    ...(data ? utility.makeupProduct(data.todaySumEnergy) : undefined)
                },
                sub: {
                    text: 'Tổng Sản lượng tích lũy',
                    ...(data ? utility.makeupProduct(data.allSumEnergy) : undefined)
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
            let makeup = utility.makeupMoney(data.todaySumEnergy * price);
            value = makeup.value + makeup.unit;

            makeup = utility.makeupMoney(data.allSumEnergy * price);
            totalValue = makeup.value + makeup.unit;

            unit = currency;
            totalUnit = currency;
        }

        return <OverviewInfo info={{
            main: {
                text: 'Lợi nhuận trong ngày',
                ...(data ? {
                    value: value ? value : '',
                    unit: unit ? unit : 'chưa cài đặt'
                } : undefined)
            },
            sub: {
                text: 'Tổng doanh thu',
                ...(data ? {
                    value: totalValue ? totalValue : '--',
                    unit: totalUnit ? totalUnit : ''
                } : undefined)
            }
        }}/>;
    }, [overviewData]);

    const chartDom = useMemo(() => site ? <SimpleChar url={'/site/trend?id=' + encodeURIComponent(site.id)}/> : <></>, [site]);

    return <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
            <StatusBanner statusId={site?.status} title={'Trạng thái'}/>
            {!!overviewDataError && <HelperText style={{ marginStart: 5 }} type={'error'} visible={true}>Lỗi: {overviewDataError}</HelperText>}
            {infoDom}
            {incomeDom}
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
