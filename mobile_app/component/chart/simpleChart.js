import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, DataTable, Dialog, IconButton, Portal, Text, TouchableRipple } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { colors } from '../../common/themes';
import ServerContext from '../../context/serverContext';
import MonthSelectorCalendar from 'react-native-month-selector';
import * as Localization from 'expo-localization';
import { LineChart, Grid, YAxis, XAxis, BarChart } from 'react-native-svg-charts';
import utility from '../../common/utility';

const timeTypes = [
    {
        id: 'day',
        label: 'Ngày',
        views: ['year', 'month', 'date'],
        format: 'YYYY-MM-DD',
        openTo: 'date',
        basedTime: 'day',
        start: 'd',
        space: 'h',
        timeFormatChart: 'H',
        timeFormatTable: 'HH[:]mm',
        type: 'power',
        chartType: LineChart,
        legend: 'Công xuất',
        svg: { stroke: colors.PHILIPPINE_ORANGE },
        findUnitDiv: (series) => utility.findUnit(series, 'W', 1)
    },
    {
        id: 'month',
        label: 'Tháng',
        views: ['year', 'month'],
        format: 'YYYY-MM',
        openTo: 'month',
        basedTime: 'month',
        start: 'M',
        space: 'd',
        timeFormatChart: 'D',
        timeFormatTable: 'D[/]MM',
        type: 'energy',
        chartType: BarChart,
        legend: 'Sản lương',
        svg: { fill: colors.PHILIPPINE_ORANGE },
        findUnitDiv: (series) => utility.findUnit(series, 'Wh', 1000)
    },
    {
        id: 'year',
        label: 'Năm',
        views: ['year'],
        format: 'YYYY',
        openTo: 'year',
        basedTime: 'year',
        start: 'y',
        space: 'M',
        timeFormatChart: 'M',
        timeFormatTable: 'MM[/]YYYY',
        type: 'energy',
        chartType: BarChart,
        legend: 'Sản lương',
        svg: { fill: colors.PHILIPPINE_ORANGE },
        findUnitDiv: (series) => utility.findUnit(series, 'Wh', 1000)
    },
];

const SimpleChar = ({ url, showTable }) => {
    const serverContext = useContext(ServerContext);

    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let discard = false;
        setLoading(true);
        setError(false);

        (async () => {
            const type = { ...timeType };
            const getTime = moment(time);
            try {
                const response = await serverContext.axios.get(url + (url.includes('?') ? '&' : '?') + `date=${getTime.format('YYYY-MM-DD')}&basedTime=${type.basedTime}&type=${type.type}`);
                if (!discard) {
                    setData({
                        ...response.data,
                        timeType: type,
                        time: getTime.toDate()
                    });
                } else {
                    return;
                }
            } catch (e) {
                // ignore
                setError(true);
            }
            setLoading(false);
        })();

        return () => {
            discard = true;
        };
    }, [url, time, timeType, serverContext]);

    const dateTypeDom = useMemo(() => {
        return <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
            {timeTypes.map(type => <TouchableRipple style={{ flex: 1, alignItems: 'center' }} key={type.id} onPress={() => setTimeType(type)}>
                <>
                    <Text style={{ color: timeType.id === type.id ? colors.PHILIPPINE_ORANGE : colors.primaryText, paddingBottom: 5, paddingTop: 5 }}>{type.label}</Text>
                    <View style={{ width: '60%', height: 3, backgroundColor: timeType.id === type.id ? colors.PHILIPPINE_ORANGE : 'transparent' }}/>
                </>
            </TouchableRipple>)}
        </View>;
    }, [timeType]);

    const dateTimeButtonDom = useMemo(() => {
        const canNext = Date.now() > moment(time).add(1, timeType.start);

        return <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <IconButton style={{ marginStart: 20 }} icon={() => <Ionicons name='chevron-back' size={24} color='black'/>} onPress={() => setTime(moment(time).add(-1, timeType.start).toDate())}/>
            <TouchableRipple style={{ flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 10 }} onPress={() => timeType.id !== 'year' && setShowPicker(true)}>
                <Text>{moment(time).format(timeType.format)}</Text>
            </TouchableRipple>
            <IconButton style={{ marginEnd: 20 }} icon={() => <Ionicons name='chevron-forward' size={24} color='black'/>} disabled={!canNext} onPress={() => setTime(moment(time).add(1, timeType.start).toDate())}/>
        </View>;
    }, [timeType, time]);

    const dateTimePickerDom = useMemo(() => {
        return <>
            {showPicker && timeType.id === 'day' && <DateTimePicker
                value={time}
                mode={'date'}
                is24Hour={true}
                display='default'
                onChange={(event, date) => {
                    setShowPicker(false);
                    if (date) {
                        setTime(moment(date).toDate());
                    }
                }}
                maximumDate={new Date()}
            />}
            <Portal>
                <Dialog visible={showPicker && timeType.id === 'month'} onDismiss={() => setShowPicker(false)}>
                    <Dialog.Content>
                        <MonthSelectorCalendar
                            selectedDate={moment(time)}
                            initialView={moment(time)}
                            swipable={true}
                            localeLanguage={Localization.locale.split('-')[0]}
                            localeSettings={moment.locale(Localization.locale.split('-')[0])}
                            selectedBackgroundColor={colors.PHILIPPINE_ORANGE}
                            currentMonthTextStyle={{ color: colors.PHILIPPINE_ORANGE }}
                            monthTextStyle={{ fontSize: 13, color: colors.primaryText }}
                            nextIcon={<Ionicons name='chevron-forward' size={24} color='black'/>}
                            prevIcon={<Ionicons name='chevron-back' size={24} color='black'/>}
                            onMonthTapped={(date) => {
                                setTime(date.toDate());
                                setShowPicker(false);
                            }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowPicker(false)}>Đóng</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>;
    }, [timeType, time, showPicker, dateTimeButtonDom]);

    const processedData = useMemo(() => {
        let dataSeries = [0, 0], dataLabels = ['', ''], tableLabels = ['', ''];
        let { series, timeType, time } = (data || {});
        if (series?.length) {
            dataLabels = [];
            tableLabels = [];
            let start = moment(time).startOf(timeType.start);
            let end = moment(time).startOf(timeType.start).add(1, timeType.start);

            let duration = end.toDate().getTime() - start.toDate().getTime();
            let space = duration / series.length;

            for (let i = 0; i < series.length; i++) {
                // dataLabels.push(start.toDate().getTime());
                tableLabels.push(start.format(timeType.timeFormatTable));
                dataLabels.push(start.format(timeType.timeFormatChart));
                start = start.add(space, 'ms');
            }

            dataSeries = series;
        }

        const maxXLabels = 4;
        let showLabels = [];
        let amount = 0;
        if (dataLabels.length > maxXLabels) {
            const space = dataLabels.length / maxXLabels;
            for (let i = 0; i < dataLabels.length; i++) {
                if ((i + 1) >= amount) {
                    showLabels.push(dataLabels[i]);
                    amount += space;
                } else {
                    showLabels.push('');
                }
            }
        } else {
            showLabels = dataLabels;
        }

        const Component = timeType ? timeType.chartType : timeTypes[0].chartType;
        const svg = timeType?.svg || timeTypes[0].svg;
        const legend = timeType?.legend || timeTypes[0].legend;
        const findUnitDiv = timeType?.findUnitDiv || timeTypes[0].findUnitDiv;
        // const id = timeType?.id || timeTypes[0].id;

        const { div, unit } = findUnitDiv(dataSeries);
        dataSeries = dataSeries.map(s => s / div);

        return { dataSeries, Component, svg, tableLabels, showLabels, legend, unit };
    }, [data]);

    const chartDom = useMemo(() => {
        const { dataSeries, Component, svg, showLabels, legend, unit } = processedData;

        return <View style={{ opacity: (loading || error) ? 0.5 : 1 }}>
            <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'checkbox-blank-circle'} size={12} color={colors.PHILIPPINE_ORANGE}/>
                <Text style={{ fontSize: 13, color: colors.primaryText, marginLeft: 10 }}>{legend + ` (${unit})`}</Text>
            </View>
            <View style={{ height: 250, flexDirection: 'row', paddingStart: 10, paddingEnd: 10 }}>
                <YAxis
                    style={{ height: 220 }}
                    data={dataSeries}
                    contentInset={{ top: 20, bottom: 10 }}
                    svg={{
                        fill: colors.DARK_SOULS,
                        fontSize: 10,
                    }}
                    numberOfTicks={4}
                    min={0}
                    formatLabel={(value) => `${value}`}
                />
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <Component
                        style={{ height: 220 }}
                        data={dataSeries}
                        svg={svg}
                        contentInset={{ top: 20, bottom: 10, left: 0, right: 0 }}
                        yMin={0}
                    >
                        <Grid
                            svg={{ stroke: colors.UNICORN_SILVER }}
                        />
                        {(loading || error) && <View style={{ width: '100%', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                            <Text style={{ backgroundColor: colors.UNICORN_SILVER, padding: 5, borderRadius: 10 }}>{loading ? 'Đang tải...' : 'Đã xảy ra lỗi'}</Text>
                        </View>}
                    </Component>
                    <XAxis
                        style={{ height: 30 }}
                        data={dataSeries}
                        formatLabel={(value, index) => showLabels[index]}
                        contentInset={{ left: 5, right: 5 }}
                        svg={{ fontSize: 10, fill: colors.DARK_SOULS, textAnchor: 'middle' }}
                    />
                </View>
            </View>
        </View>;
    }, [processedData, loading]);

    const [page, setPage] = useState(0);
    useEffect(() => {
        setPage(0);
    }, [data]);

    const tableDom = useMemo(() => {
        const { dataSeries, tableLabels, legend, unit } = processedData;

        if (!showTable || loading || dataSeries.length !== tableLabels.length) {
            return;
        }

        const pageLimit = 35;

        const from = page * pageLimit;
        const to = (page + 1) * pageLimit;

        const slidedSeries = dataSeries.slice(pageLimit * page, pageLimit * (page + 1));
        const slidedSLabel = tableLabels.slice(pageLimit * page, pageLimit * (page + 1));

        return <DataTable>
            <DataTable.Header>
                <DataTable.Title><Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: 'bold' }}>Thời gian</Text></DataTable.Title>
                <DataTable.Title><Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: 'bold' }}>{legend + ` (${unit})`}</Text></DataTable.Title>
            </DataTable.Header>
            {slidedSeries.map((value, index) => <DataTable.Row key={index}>
                <DataTable.Cell>
                    <Text style={{ color: colors.primaryText, fontSize: 13 }}>{slidedSLabel[index]}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                    <Text style={{ color: colors.primaryText, fontSize: 13 }}>{slidedSeries[index]}</Text>
                </DataTable.Cell>
            </DataTable.Row>)}
            {dataSeries.length > pageLimit && <DataTable.Pagination
                page={page}
                numberOfPages={Math.floor(dataSeries.length / pageLimit) + 1}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${dataSeries.length}`}
            />}
        </DataTable>;
    }, [processedData, showTable, loading, page]);

    return <View style={{ width: '100%', backgroundColor: 'white', marginTop: 5 }}>
        {dateTypeDom}
        {dateTimeButtonDom}
        {dateTimePickerDom}
        {chartDom}
        {tableDom}
    </View>;
};

export default SimpleChar;
