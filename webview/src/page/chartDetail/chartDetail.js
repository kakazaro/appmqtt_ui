import React, { useEffect, useMemo, useRef, useState } from 'react';
import FreshestLayout from '../../components/layout/freshestLayout';
import { Container } from 'react-bootstrap';
import sizeService from '../../service/sizeService';
import Chart from 'react-apexcharts';
import { throttle } from 'lodash';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab';
import moment from 'moment';
import classNames from 'classnames';

import './chartDetail.scss';
import utility from '../../service/utility';

const ChartDetail = ({ location }) => {
    const [dataChart] = useState(location?.state?.dataChart);
    const [timeType] = useState(location?.state?.timeType);
    const [title] = useState(location?.state?.title);
    const [time] = useState(location?.state?.time);

    const divNumber = useMemo(() => utility.findProductUnit(dataChart.series), [dataChart]);

    const [series, SetSeries] = useState();
    const [options, SetOptions] = useState();
    const [chartWidth, setChartWidth] = useState(300);
    const [focusIndex, setFocusIndex] = useState(0);

    const throttledFocus = useRef(throttle((i) => setFocusIndex(i), 200));

    useEffect(() => {
        const handleResize = (width) => {
            setChartWidth(width);
        };

        const id = Math.random();
        sizeService.register(id, handleResize);

        return () => {
            sizeService.unregister(id);
        };
    }, []);

    useEffect(() => {
        SetSeries([
                {
                    name: 'series1',
                    data: dataChart.series
                },
            ]
        );

        SetOptions({

            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                },
                events: {
                    click: (event, chartContext, config) => {
                        // event.preventDefault();
                        // console.log(config);
                    }
                },
                // offsetX: 12,
                // offsetY: 20,
                selection: {
                    enabled: false,
                }
            },
            title: {
                text: moment(time).format(timeType.format),
                align: 'center',
                // margin: 10,
                offsetX: 0,
                offsetY: -5,
                floating: false,
                style: {
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: 'rgba(255,255,255,0.77)'
                },
            },
            dataLabels: {
                enabled: false
            },
            annotations: {
                // points: [{
                //     x: dataChart.series.length - focusIndex,
                //     y: dataChart.series[dataChart.series.length - 1 - focusIndex] || null,
                //     marker: {
                //         size: 5,
                //         fillColor: '#ffffff',
                //         strokeColor: '#ffffff',
                //     },
                // }],
                xaxis: [{
                    x: dataChart.times[focusIndex],
                    x2: null,
                    strokeDashArray: 2,
                    borderColor: 'rgba(255,255,255,0.77)',
                    opacity: 0.3,
                    offsetX: 0,
                    offsetY: 0,
                    label: {
                        borderWidth: 0,
                        text: Math.floor(dataChart.series[focusIndex] / divNumber.div) + divNumber.unit,
                        textAnchor: 'middle',
                        position: 'top',
                        orientation: 'horizontal',
                        offsetX: 0,
                        offsetY: -15,
                        style: {
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.72)',
                            fontSize: '12px',
                            fontWeight: 400,
                            fontFamily: undefined,
                            cssClass: 'apexcharts-xaxis-annotation-label',
                        },
                    },
                }]
            },
            colors: ['#ffffff'],
            fill: {
                // color: '#ffffff',
                // type: 'gradient',
                // gradient: {
                //     shadeIntensity: 1,
                //     opacityFrom: 0.4,
                //     opacityTo: 0.0,
                //     stops: [0, 100, 100, 100, 100, 100]
                // },
            },
            stroke: {
                // curve: 'smooth',
                // width: 4,
                // lineCap: 'butt'
            },
            grid: {
                show: true,
                borderColor: 'rgba(255,255,255,0.18)',
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
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 3,
                    columnWidth: '80%',
                    distributed: false,
                    rangeBarOverlap: true,
                    rangeBarGroupRows: false,
                }
            },
            labels: dataChart.times,
            xaxis: {
                show: true,
                tickAmount: 5,
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
                        colors: 'rgba(255,255,255,0.42)',
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
                tickAmount: 4,
                forceNiceScale: true,
                labels: {
                    show: true,
                    style: {
                        colors: 'rgba(255,255,255,0.42)',
                        fontSize: '11px',
                    },
                    formatter: (value) => {
                        return Math.floor(value / divNumber.div);
                    },
                }
            },
            tooltip: {
                enabled: false,
                shared: false,
            },
        });
    }, [dataChart, time, timeType, focusIndex, divNumber]);

    const bodyDom = useMemo(() => {
        if (!dataChart) {
            return null;
        }

        const map = Array(dataChart.series.length).fill('').map((v, index) => ({ value: dataChart.series[index], time: dataChart.times[index] }));
        return <Timeline>
            {map.map((point, index) => <TimelineItem key={index}>
                <TimelineOppositeContent>
                    <div className={'chartTime'}>
                        {moment(point.time).format(timeType ? timeType.timeFormatTable + '' : 'D/M')}
                    </div>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot className={classNames({ active: index === focusIndex })}/>
                    {(index + 1) !== dataChart.series.length && <TimelineConnector/>}
                </TimelineSeparator>
                <TimelineContent>
                    <Container className={classNames('chartBadge')}>
                        <p>{Math.floor(point.value * 10 / divNumber.div) / 10} <span className={'unitPower'}>{divNumber.unit}</span></p>
                    </Container>
                </TimelineContent>
            </TimelineItem>)}
        </Timeline>;
    }, [dataChart, timeType, focusIndex, divNumber]);

    if (!dataChart || !series || !options) {
        return null;
    }

    return <FreshestLayout className="chartDetail" title={title || 'Biểu đồ'} canBack={true}>
        <div className="chartBody">
            <div className={'chartBox'}>
                <Chart
                    className={'chart'}
                    options={options}
                    series={series}
                    width={chartWidth}
                    height={'auto'}
                    type={'bar'}
                />
            </div>
            <div className={'timeBox'}>
                <div className={'timeInner'} onScroll={(e) => {
                    const element = e.target;
                    const length = dataChart.series.length;
                    const height = element.scrollHeight - element.clientHeight;
                    const space = height / length;

                    const scroll = element.scrollTop;

                    let index = Math.floor(scroll / space);
                    index = index < 0 ? 0 : index >= length ? length - 1 : index;
                    throttledFocus.current(index);
                }}>
                    {bodyDom}
                </div>
            </div>
        </div>
    </FreshestLayout>;
};

export default ChartDetail;
