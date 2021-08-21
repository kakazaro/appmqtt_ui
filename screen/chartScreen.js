import React, { useMemo } from 'react';
import AppBarLayout from '../component/appBarLayout';
import { ScrollView, View } from 'react-native';
import WebChart from '../component/chart/webChart';
import TableChart from '../component/chart/tableChart';

const ChartScreen = ({ route }) => {
    const chartData = useMemo(() => route?.params?.chartData, [route]);

    const dom = useMemo(() => {
        if (!chartData) {
            return;
        }

        return <View style={{ flexDirection: 'column', flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 0 }}>
                <WebChart data={chartData.data} hideExpand={true}/>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <TableChart data={chartData.data}/>
            </ScrollView>
        </View>;
    }, [chartData]);

    const title = useMemo(() => chartData?.data ? chartData.data.date : '', [chartData]);

    return <AppBarLayout title={title}>
        {dom}
    </AppBarLayout>;
};

export default ChartScreen;
