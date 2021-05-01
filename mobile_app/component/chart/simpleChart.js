import React, { useState } from 'react';


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
        timeFormatChart: 'H[h]',
        timeFormatTable: 'H [giờ]',
        type: 'line',
        stroke: { width: 2 }
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
        type: 'bar',
        stroke: { width: 0 }
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
        type: 'bar',
        stroke: { width: 0 }
    },
];

const SimpleChar = () => {
    const [series, SetSeries] = useState();
    const [options, SetOptions] = useState();
    const [chartWidth, setChartWidth] = useState(300);

    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());
    const [data, setData] = useState({});

    return <></>
};

export default SimpleChar;
