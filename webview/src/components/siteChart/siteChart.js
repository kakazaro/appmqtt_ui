import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Chart from 'react-apexcharts';

import './siteChart.scss';

const SiteChart = ({ title, unit }) => {
    const ref = useRef(null);
    const [series, SetSeries] = useState();
    const [options, SetOptions] = useState();
    const [chartWidth, setChartWidth] = useState(300);
    const chartHeight = useMemo(() => chartWidth * 2 / 3, [chartWidth]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (ref?.current) {
                setChartWidth(ref.current.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [ref, series, options]);

    useEffect(() => {
        SetSeries([
                {
                    name: 'series1',
                    data: Array(24).fill('').map(() => Math.random() * 40)
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
                offsetX: -10
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#17abf1', '#d5d5d5'],
            stroke: {
                curve: 'smooth',
                width: 1,
            },
            grid: {
                show: false
            },
            xaxis: {
                type: 'number',
                tickAmount: 4,
                categories: Array(24).fill('').map((value, index) => index),
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    show: true,
                    style: {
                        colors: '#9a9a9a',
                        fontSize: '11px',
                    },
                    rotate: 0,
                },
            },
            yaxis: {
                show: true,
                tickAmount: 3,
                labels: {
                    show: true,
                    style: {
                        colors: '#9a9a9a',
                        fontSize: '11px',
                    },
                    formatter: (value) => { return Math.floor(value) },
                },
            },
            tooltip: {
                enabled: false
            },
        });
    }, []);

    if (!series || !options) {
        return null;
    }

    return <div className="siteChart" ref={ref}>
        <p className={'headerChart'}><span className={'title'}>{title}</span> <span className={'unit'}>{unit}</span></p>
        <Chart options={options} series={series} type="area" width={chartWidth} height={chartHeight}/>
    </div>;
};

export default SiteChart;
