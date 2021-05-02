import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Dialog, IconButton, Portal, Text, TouchableRipple } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { colors } from '../../common/themes';
import ServerContext from '../../context/serverContext';
import MonthSelectorCalendar from 'react-native-month-selector';
import * as Localization from 'expo-localization';
import { LineChart, Grid, YAxis, XAxis, BarChart } from 'react-native-svg-charts';

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
        timeFormatTable: 'H [giờ]',
        type: 'power',
        chartType: LineChart,
        legend: 'Công xuất (W)',
        svg: { stroke: colors.PHILIPPINE_ORANGE },
        stroke: { width: 2 },
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
        timeFormatTable: '[ngày] D',
        type: 'energy',
        chartType: BarChart,
        legend: 'Sản lương (kWh)',
        svg: { fill: colors.PHILIPPINE_ORANGE },
        stroke: { width: 0 },
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
        timeFormatTable: '[tháng] MM',
        type: 'energy',
        chartType: BarChart,
        legend: 'Sản lương (kWh)',
        svg: { fill: colors.PHILIPPINE_ORANGE },
        stroke: { width: 0 },
    },
];

const SimpleChar = ({ url }) => {
    const serverContext = useContext(ServerContext);

    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [data, setData] = useState();

    useEffect(() => {
        let discard = false;

        (async () => {
            const type = { ...timeType };
            const getTime = moment(time);
            const response = await serverContext.axios.get(url + (url.includes('?') ? '&' : '?') + `date=${getTime.format('YYYY-MM-DD')}&basedTime=${type.basedTime}&type=${type.type}`);
            if (!discard) {
                setData({
                    ...response.data,
                    timeType: type,
                    time: getTime.toDate()
                });
            }
        })();

        return () => {
            discard = true;
        };
    }, [url, time, timeType, serverContext]);

    const dateTypeDom = useMemo(() => {
        return <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 5 }}>
            {timeTypes.map(type => <TouchableRipple style={{ flex: 1, alignItems: 'center' }} key={type.id} onPress={() => setTimeType(type)}>
                <>
                    <Text style={{ color: timeType.id === type.id ? colors.PHILIPPINE_ORANGE : colors.primaryText, paddingBottom: 3 }}>{type.label}</Text>
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

    const chartDom = useMemo(() => {
        let dataSeries = [0, 0], dataLabels = [0, 1];
        let { series, timeType, time } = (data || {});
        if (series?.length) {
            dataLabels = [];
            let start = moment(time).startOf(timeType.start);
            let end = moment(time).startOf(timeType.start).add(1, timeType.start);

            let duration = end.toDate().getTime() - start.toDate().getTime();
            let space = duration / series.length;

            for (let i = 0; i < series.length; i++) {
                dataLabels.push(start.toDate().getTime());
                // dataLabels.push(start.format(timeType.timeFormatChart));
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
                    showLabels.push(moment(dataLabels[i]).format(timeType.timeFormatChart));
                    amount += space;
                } else {
                    showLabels.push('');
                }
            }
        } else {
            showLabels = dataLabels.map(l => timeType ? moment(l).format(timeType.timeFormatChart) : '');
        }

        const Component = timeType ? timeType.chartType : timeTypes[0].chartType;
        const svg = timeType?.svg || timeTypes[0].svg;
        const legend = timeType?.legend || timeTypes[0].legend;

        return <View>
            <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'checkbox-blank-circle'} size={12} color={colors.PHILIPPINE_ORANGE}/>
                <Text style={{ fontSize: 13, color: colors.primaryText, marginLeft: 10 }}>{legend}</Text>
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
                    </Component>
                    <XAxis
                        style={{ marginHorizontal: -5, height: 30 }}
                        data={dataSeries}
                        formatLabel={(value, index) => {
                            // console.log(index);
                            return showLabels[index];
                        }}
                        contentInset={{ left: 5, right: 5 }}
                        svg={{ fontSize: 10, fill: colors.DARK_SOULS }}
                    />
                </View>
            </View>
        </View>;
    }, [data]);

    return <View style={{ width: '100%', backgroundColor: 'white', marginTop: 5 }}>
        {dateTypeDom}
        {dateTimeButtonDom}
        {dateTimePickerDom}
        {chartDom}
    </View>;
};

export default SimpleChar;
