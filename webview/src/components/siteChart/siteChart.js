import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import sizeService from '../../service/sizeService';
import moment from 'moment';
import utility from '../../service/utility';

import './siteChart.scss';

const SiteChart = ({ title, data, date, timeType, onClick }) => {
    const ref = useRef(null);
    const [series, SetSeries] = useState();
    const [options, SetOptions] = useState();
    const [chartWidth, setChartWidth] = useState(300);

    const divNumber = useMemo(() => utility.findProductUnit(data.series), [data]);

    // const chartHeight = useMemo(() => chartWidth * 2 / 3, [chartWidth]);

    useEffect(() => {
        const handleResize = (width) => {
            setChartWidth(width - 50);
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
                    data: data.series
                },
            ]
        );

        SetOptions({
            chart: {
                // height: 'auto',
                // width: '100%',
                type: 'bar',
                toolbar: {
                    show: false
                },
                // offsetX: -12,
                // offsetY: 20
            },
            dataLabels: {
                enabled: false
            },
            labels: data.times,
            colors: ['#317ad4'],
            fill: {
                type: 'solid',
                colors: ['#317ad4']
            },
            stroke: {
                // show: true,
                // width: 2,
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
        });
    }, [data, timeType, divNumber]);

    if (!series || !options) {
        return null;
    }

    return <div className="siteChart" ref={ref} onClick={(e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    }}>
        <p className={'headerChart'}><span className={'title'}>{title}</span> <span className={'unit'}>{divNumber.unit}</span></p>
        <Chart
            className={'chart'}
            options={options}
            series={series}
            type="bar"
            width={chartWidth}
            height={'auto'}
            // height={chartHeight}
        />
    </div>;
};

export default SiteChart;
