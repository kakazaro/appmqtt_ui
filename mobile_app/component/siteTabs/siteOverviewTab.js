import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import utility from '../../common/utility';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ServerContext from '../../context/serverContext';
import {
    Placeholder,
    PlaceholderLine,
    ShineOverlay
} from 'rn-placeholder';
import SimpleChar from '../chart/simpleChart';
import { SiteContext } from '../../screen/siteScreen';

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
                <Text style={{ textAlign: 'right', color: colors.primaryText }}>
                    <Text style={{ fontSize: 22 }}>{info.main.value}</Text>
                    <Text style={{ fontSize: 15, marginStart: 5 }}>{info.main.unit}</Text>
                </Text>}
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
                    <Text style={{ textAlign: 'right', fontSize: 13, color: colors.secondaryText }}>
                        <Text style={{ color: colors.secondaryText }}>{info.sub.value}</Text>
                        <Text style={{ color: colors.secondaryText }}>{info.sub.unit}</Text>
                    </Text>}
            </View>
        </View>
    </View>;
};

const SiteOverviewTab = ({ route }) => {
    const serviceContext = useContext(ServerContext);
    const siteContext = useContext(SiteContext);

    const site = useMemo(() => siteContext?.site, [siteContext]);

    const [overviewData, setOverviewData] = useState();

    useEffect(() => {
        if (site?.id) {
            const uid = serviceContext.dataControl.registerSiteData({
                url: 'site/overview?id=' + encodeURIComponent(site.id),
                handler: setOverviewData,
                duration: 10000
            });

            return () => serviceContext.dataControl.unRegisterSiteData(uid);
        }
    }, [site, serviceContext]);


    const siteStatus = useMemo(() => {
        const statusId = site?.status;
        const key = Object.keys(utility.STATUS).find(key => utility.STATUS[key].id === statusId);
        const status = key ? utility.STATUS[key] : undefined;

        return <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'white', paddingTop: 8, paddingBottom: 8 }}>
            <View style={styles.statusView}>
                <Text style={styles.statusText}>
                    Trạng thái trạm điện
                </Text>
            </View>
            <View style={styles.statusView}>
                {status && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name={'checkbox-blank-circle'} size={14} color={colors[status.id] || colors.offline}/>
                    <Text style={[styles.statusText, { paddingStart: 5 }]}>{status.label}</Text>
                </View>}
            </View>
        </View>;
    }, [site]);

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
            <OverviewInfo info={{
                main: {
                    text: 'Lợi nhuận trong ngày',
                    ...(data ? utility.makeupMoney(data.todaySumEnergy * 1720) : undefined)
                },
                sub: {
                    text: 'Tổng doanh thu',
                    ...(data ? utility.makeupMoney(data.allSumEnergy * 1720) : undefined)
                }
            }}/>
        </>;
    }, [overviewData]);

    const chartDom = useMemo(() => site ? <SimpleChar url={'/site/trend?id=' + encodeURIComponent(site.id)}/> : <></>, [site]);

    return <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
            {siteStatus}
            {infoDom}
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
    },
    statusView: {
        flex: 1,
        alignItems: 'center'
    },
    statusText: {
        fontSize: 13,
        color: colors.secondaryText
    },
});

export default SiteOverviewTab;
