import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Dialog, IconButton, Portal, Text, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { colors } from '../../common/themes';
import ServerContext from '../../context/serverContext';
import MonthSelectorCalendar from 'react-native-month-selector';
import * as Localization from 'expo-localization';
import utility from '../../common/utility';
import WebChart from './webChart';
import serverError from '../../common/serverError';
import TableChart from './tableChart';

const timeTypes = [
    {
        id: 'day',
        label: 'Ngày',
        format: 'YYYY-MM-DD',
        openTo: 'date',
        basedTime: 'day',
        start: 'd',
        space: 'h',
        timeFormatChart: 'H',
        timeFormatTable: 'HH[:]mm',
        type: 'power',
        chartType: 'line',
        legend: 'Công xuất',
        stroke: { width: 2 },
        findUnitDiv: (series) => utility.findUnit(series, 'W', 1)
    },
    {
        id: 'month',
        label: 'Tháng',
        format: 'YYYY-MM',
        openTo: 'month',
        basedTime: 'month',
        start: 'M',
        space: 'd',
        timeFormatChart: 'D',
        timeFormatTable: 'D[/]MM',
        type: 'energy',
        chartType: 'bar',
        legend: 'Sản lương',
        stroke: { width: 0 },
        findUnitDiv: (series) => utility.findUnit(series, 'Wh', 1)
    },
    {
        id: 'year',
        label: 'Năm',
        format: 'YYYY',
        openTo: 'year',
        basedTime: 'year',
        start: 'y',
        space: 'M',
        timeFormatChart: 'M',
        timeFormatTable: 'MM[/]YYYY',
        type: 'energy',
        chartType: 'bar',
        legend: 'Sản lương',
        stroke: { width: 0 },
        findUnitDiv: (series) => utility.findUnit(series, 'Wh', 1)
    },
];

const SimpleChar = ({ url, showTable, hideExpand }) => {
    const serverContext = useContext(ServerContext);

    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let discard = false;
        setLoading(true);
        setError('');

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
                setError(serverError.getError(e));
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
        let dataSeries = [0, 0], times = [0, 1], tableLabels = ['', ''];
        let { series, timeType, time } = (data || {});
        if (series?.length) {
            times = [];
            tableLabels = [];
            let start = moment(time).startOf(timeType.start);
            let end = moment(time).startOf(timeType.start).add(1, timeType.start);

            let duration = end.toDate().getTime() - start.toDate().getTime();
            let space = duration / series.length;

            for (let i = 0; i < series.length; i++) {
                // dataLabels.push(start.toDate().getTime());
                tableLabels.push(start.format(timeType.timeFormatTable));
                times.push(start.toDate().getTime());
                start = start.add(space, 'ms');

                if (timeType.id === 'year') {
                    start = start.add(1, 'd');
                }
            }

            dataSeries = series;
        }

        const Component = timeType ? timeType.chartType : timeTypes[0].chartType;
        const legend = timeType?.legend || timeTypes[0].legend;
        const findUnitDiv = timeType?.findUnitDiv || timeTypes[0].findUnitDiv;
        const date = timeType ? moment(time).format(timeType.format) : '';

        const { div, unit } = findUnitDiv(dataSeries);
        dataSeries = dataSeries.map(s => (s || 0) / div).map(s => Math.floor(s * 100) / 100);

        // Remove data in future
        for (let i = dataSeries.length - 1; i >= 0; i--) {
            const t = times[i];
            const d = dataSeries[i];
            if (!t || t <= (Date.now() - 5 * 60 * 1000) || (typeof d === 'number' && d !== 0)) {
                break;
            }

            dataSeries[i] = undefined;
        }

        return { dataSeries, Component, times, tableLabels, legend, unit, div, timeType, date };
    }, [data]);

    const tableDom = useMemo(() => {
        if (!showTable || loading) {
            return;
        }

        return <TableChart data={processedData}/>;
    }, [processedData, showTable, loading]);

    const webChartDom = useMemo(() => {
        const { legend, unit, div } = processedData;

        const data = { ...processedData, name: legend, divNumber: { unit, div } };

        return <WebChart data={data} error={error} loading={loading} hideExpand={hideExpand}/>;
    }, [processedData, error, loading, hideExpand]);

    return <View style={{ width: '100%', backgroundColor: 'white', marginTop: 5 }}>
        {dateTypeDom}
        {dateTimeButtonDom}
        {dateTimePickerDom}
        {webChartDom}
        {tableDom}
    </View>;
};

export default SimpleChar;
