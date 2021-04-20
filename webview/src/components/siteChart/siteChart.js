import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import Chart from 'react-apexcharts';
import sizeService from '../../service/sizeService';
import moment from 'moment';
import utility from '../../service/utility';
import { Col, Row } from 'react-bootstrap';
import siteService from '../../service/siteService';
import { DatePicker } from '@material-ui/pickers';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';

import './siteChart.scss';

const timeTypes = [
    {
        id: 'day',
        label: 'Ngày',
        views: ['year', 'month', 'date'],
        format: 'YYYY-MM-DD',
        openTo: 'date',
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
        start: 'y',
        space: 'M',
        timeFormatChart: 'M',
        timeFormatTable: '[tháng] MM',
        type: 'bar',
        stroke: { width: 0 }
    },
];

const SiteChart = ({ siteId }) => {
    const [series, SetSeries] = useState();
    const [options, SetOptions] = useState();
    const [chartWidth, setChartWidth] = useState(300);

    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());
    const [data, setData] = useState({});

    const divNumber = useMemo(() => utility.findProductUnit(data.series), [data]);

    useEffect(() => {
        const handleResize = (width) => {
            // setChartWidth(width - 50);
            setChartWidth(width);
        };

        const id = Math.random();
        sizeService.register(id, handleResize);

        return () => {
            sizeService.unregister(id);
        };
    }, []);

    useEffect(() => {
        const handle = (data) => setData(data);
        let m = moment(time);
        const registerId = siteService.registerSiteData(siteId, 'chart', handle, {
            time: m.toDate().getTime(),
            space: timeType.space,
            start: timeType.start
        });

        return () => {
            siteService.unRegisterSiteData(registerId);
        };
    }, [siteId, timeType, time]);

    useEffect(() => {
        SetSeries([
                {
                    name: `Công xuất ${divNumber.unit}`,
                    data: data.series
                },
            ]
        );

        SetOptions({
            chart: {
                type: timeType.type,
                toolbar: {
                    show: false
                },
            },
            dataLabels: {
                enabled: false
            },
            labels: data.times,
            colors: ['#ff7300'],
            fill: {
                type: 'solid',
                colors: ['#ff7300']
            },
            stroke: {
                show: true,
                ...timeType.stroke
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 3,
                    columnWidth: '70%',
                    distributed: false,
                    rangeBarOverlap: true,
                    rangeBarGroupRows: false,
                }
            },
            grid: {
                show: true,
                position: 'back',
                borderColor: 'rgba(154,154,154,0.28)',
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            xaxis: {
                show: true,
                // type: 'number',
                tickAmount: 4,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    show: true,
                    rotate: 0,
                    style: {
                        colors: 'rgba(154,154,154,0.57)',
                        fontSize: '11px',
                    },
                    // rotate: 0,
                    formatter: (value) => {
                        return moment(new Date(value)).format(timeType ? timeType.timeFormatChart + '' : 'D/M');
                    },
                },
            },
            yaxis: {
                show: true,
                tickAmount: 3,
                labels: {
                    show: true,
                    style: {
                        colors: 'rgba(154,154,154,0.57)',
                        fontSize: '11px',
                    },
                    formatter: (value) => {
                        return Math.floor(value / divNumber.div);
                    },
                },
            },
            tooltip: {
                enabled: false
            },
            legend: {
                show: true,
                showForSingleSeries: true,
                position: 'top',
                horizontalAlign: 'left',
                fontSize: '12px',
                offsetX: 0,
                markers: {
                    width: 7,
                    height: 7
                },
                onItemClick: {
                    toggleDataSeries: false
                },
                onItemHover: {
                    highlightDataSeries: false
                }
            }
        });
    }, [data, timeType, divNumber]);

    const isCanNext = useMemo(() => Date.now() > moment(time).add(1, timeType.start), [time, timeType]);

    if (!series || !options) {
        return null;
    }

    return <Col className="siteChart">
        <Row>
            <div className={'timeTypeSelector'}>
                {timeTypes.map(type => <div
                    className={classNames('timeType', { isSelected: type.id === timeType.id })}
                    onClick={() => setTimeType(type)}
                >
                    <span>{type.label}</span>
                </div>)}
            </div>
        </Row>
        <Row>
            <div className={'timePick'}>
                <div className={'previousTime'}
                     onClick={() => {
                         setTime(moment(time).add(-1, timeType.start).toDate());
                     }}>
                    <NavigateBefore/>
                </div>
                <DatePicker
                    value={time} onChange={(t) => setTime(t)}
                    format={timeType.format}
                    autoOk
                    openTo={timeType.openTo}
                    clearable
                    disableFuture
                    views={timeType.views}
                />
                <div className={classNames('nextTime', { disable: !isCanNext })}
                     onClick={() => {
                         if (isCanNext) {
                             setTime(moment(time).add(1, timeType.start).toDate());
                         }
                     }}>
                    <NavigateNext/>
                </div>
            </div>
        </Row>
        <Row>
            <Chart
                className={'chart'}
                options={options}
                series={series}
                type={timeType.type}
                width={chartWidth}
                height={'auto'}
            />
        </Row>
    </Col>;
};

export default SiteChart;
