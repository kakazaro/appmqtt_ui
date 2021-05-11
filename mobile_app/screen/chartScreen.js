import React, { useMemo } from 'react';
import AppBarLayout from '../component/appBarLayout';
import { ScrollView } from 'react-native';
import WebChart from '../component/chart/webChart';
import TableChart from '../component/chart/tableChart';

const ChartScreen = ({ route }) => {
    const chartData = useMemo(() => route?.params?.chartData, [route]);


    const dom = useMemo(() => {
        if (!chartData) {
            return;
        }

        // console.log(chartData);

        return <ScrollView>
            <WebChart data={chartData.data} hideExpand={true}/>
            <TableChart data={chartData.data}/>
        </ScrollView>;
    }, [chartData]);

    const title = useMemo(() => chartData?.data ? `${chartData.data.name} (${chartData.data.date})` : '', [chartData]);

    return <AppBarLayout title={title}>
        {dom}
    </AppBarLayout>;
};

export default ChartScreen;
