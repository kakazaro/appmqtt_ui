import React, { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import sizeService from '../../service/sizeService';

import './siteChart.scss';

const SiteChart = ({ title, data, unit }) => {
    const ref = useRef(null);
    const [series, SetSeries] = useState();
    const [options, SetOptions] = useState();
    const [chartWidth, setChartWidth] = useState(300);
    // const chartHeight = useMemo(() => chartWidth * 2 / 3, [chartWidth]);

    useEffect(() => {
        const handleResize = (width) => {
            setChartWidth(width - 38);
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
                    data
                },
                // {
                //     name: 'series2',
                //     data: [11, 32, 45, 32, 34, 52, 41]
                // }
            ]
        );

        SetOptions({
            chart: {
                // height: 'auto',
                // width: '100%',
                type: 'area',
                toolbar: {
                    show: false
                },
                offsetX: -12,
                offsetY: 20
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#17abf1', '#d5d5d5'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            grid: {
                show: false
            },
            xaxis: {
                show: false,
                // type: 'number',
                // tickAmount: 4,
                // categories: Array(24).fill('').map((value, index) => index),
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    show: false,
                    // style: {
                    //     colors: '#9a9a9a',
                    //     fontSize: '11px',
                    // },
                    // rotate: 0,
                },
            },
            yaxis: {
                show: false,
                // tickAmount: 3,
                // labels: {
                //     show: true,
                //     style: {
                //         colors: '#9a9a9a',
                //         fontSize: '11px',
                //     },
                //     formatter: (value) => {
                //         return Math.floor(value);
                //     },
                // },
            },
            tooltip: {
                enabled: false
            },
        });
    }, [data]);

    if (!series || !options) {
        return null;
    }

    return <div className="siteChart" ref={ref}>
        <p className={'headerChart'}><span className={'title'}>{title}</span> <span className={'unit'}>{unit}</span></p>
        <Chart
            className={'chart'}
            options={options}
            series={series}
            type="area"
            width={chartWidth}
            height={'auto'}
            // height={chartHeight}
        />
    </div>;
};

export default SiteChart;
