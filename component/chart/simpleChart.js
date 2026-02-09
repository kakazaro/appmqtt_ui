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
        stroke: { width: 2 },
        chartType: 'line',
        type: 'power',
        sources: {
            device: [
                {
                    path: 'trend',
                    legend: 'Công suất PV',
                    legendShort: 'CS PV',
                    unit: 'W'
                }
            ],
            site: [
                {
                    path: 'trend',
                    legend: 'Công suất PV',
                    legendShort: 'CS PV',
                    unit: 'W'
                },
                {
                    path: 'load/trend',
                    legend: 'Công suất tiêu thụ',
                    legendShort: 'CS tiêu thụ',
                    unit: 'W'
                }
            ]
        }
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
        stroke: { width: 0 },
        chartType: 'bar',
        type: 'energy',
        sources: {
            device: [
                {
                    path: 'trend',
                    legend: 'PV',
                    unit: 'Wh'
                }
            ],
            site: [
                {
                    path: 'trend',
                    legend: 'PV',
                    unit: 'Wh'
                },
                {
                    path: 'load/trend',
                    legend: 'Tiêu thụ',
                    unit: 'Wh'
                }
            ]
        }
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
        stroke: { width: 0 },
        sources: {
            device: [
                {
                    path: 'trend',
                    legend: 'PV',
                    unit: 'Wh'
                }
            ],
            site: [
                {
                    path: 'trend',
                    legend: 'PV',
                    unit: 'Wh'
                },
                {
                    path: 'load/trend',
                    legend: 'Tiêu thụ',
                    unit: 'Wh'
                }
            ]
        }
    },
];

export const ENUM_SOURCE = {
    device: 'device',
    site: 'site'
};

const SimpleChar = ({ source, id, showTable, hideExpand }) => {
    const serverContext = useContext(ServerContext);

    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [processedData, setProcessedData] = useState();

    useEffect(() => {
        let discard = false;
        setLoading(true);
        setError('');
        setData(undefined);

        (async () => {
            const type = { ...timeType };
            const getTime = moment(time);
            try {
                let data = [];
                for (let i = 0; i < type.sources[source].length; i++) {
                    const sources = timeType.sources[source][i];
                    const url = `/${source}/${sources.path}?id=${id}&date=${getTime.format('YYYY-MM-DD')}&basedTime=${type.basedTime}&type=${type.type}`;
                    const response = await serverContext.get(url);
                    data.push({
                        ...response.data,
                        ...sources
                    });
                }

                if (!discard) {
                    setData(data);
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
    }, [time, timeType, serverContext, source, id]);

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

    const lang = useMemo(() => (Localization.getLocales()[0]?.languageCode) || 'vi', []);
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
                            localeLanguage={lang}
                            localeSettings={moment.locale(lang)}
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

    useEffect(() => {
        if (!data?.length) {
            return;
        }

        let dataSeries, times, names, namesTable, tableLabels, unit;

        let { series } = data[0] || data[1];
        if (!series)
            return;

        times = [];
        tableLabels = [];
        let start = moment(time).startOf(timeType.start);
        let end = moment(time).startOf(timeType.start).add(1, timeType.start);

        let duration = end.toDate().getTime() - start.toDate().getTime();
        let space = duration / series.length;

        const allData = data.reduce((all, d) => all.concat(d.series), []);
        const { div, unit: shortUnit } = utility.findUnit(allData, '', 1);

        for (let i = 0; i < series.length; i++) {
            tableLabels.push(start.format(timeType.timeFormatTable));
            times.push(start.toDate().getTime());
            start = start.add(space, 'ms');

            if (timeType.id === 'year') {
                start = start.add(1, 'd');
            }
        }

        dataSeries = [];
        names = [];
        namesTable = [];
        unit = [];

        data.forEach((d) => {
            dataSeries.push((d.series || []).map(s => {
                if (s) {
                    const afterDiv = Math.floor(s / div);
                    if (afterDiv > 99) {
                        return afterDiv;
                    }
                    if (afterDiv > 9) {
                        return Math.floor(s * 10 / div) / 10;
                    } else {
                        return Math.floor(s * 100 / div) / 100;
                    }
                }
                return s;
            }));
            names.push(d.legend);
            namesTable.push(d.legendShort || d.legend);
            unit.push(shortUnit + d.unit);
        });

        const date = moment(time).format(timeType.format);

        setProcessedData({ dataSeries, names, namesTable, times, tableLabels, unit, timeType: { ...timeType, findUnitDiv: '' }, date });
    }, [data, timeType, time]);

    const tableDom = useMemo(() => {
        if (!showTable || loading || processedData) {
            return <></>;
        }

        return <TableChart data={processedData}/>;
    }, [processedData, showTable, loading]);

    const webChartDom = useMemo(() => {
        return <WebChart data={processedData} error={error} loading={loading} hideExpand={hideExpand}/>;
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
