import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Dimensions, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const WebChart = ({ data, error, loading, hideExpand }) => {
    const navigation = useNavigation();
    const webRef = useRef(null);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (loaded && data && webRef && webRef.current) {
            try {
                // console.log(JSON.stringify(data.dataSeries, null, 2));
                // console.log(JSON.stringify(data, null, 2));
                webRef.current.injectJavaScript(`window.loadChart(${JSON.stringify(data)});true;`);
            } catch (e) {
                console.log(e);
            }
        }
    }, [data, webRef, error, loading, loaded]);

    return <View>
        <View>
        </View>
        <View style={{ height: Dimensions.get('window').width / 1.57, width: '100%', opacity: (loading ? 0.5 : 1) }}>
            {error ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.REDDISH }}>{error}</Text>
                </View>
                :
                <>
                    <WebView
                        ref={webRef}
                        // originWhitelist={['*']}
                        // source={{ uri: 'http://10.40.50.61:3000/chart' }}
                        // source={{ uri: 'http://192.168.253.1:3000/chart' }}
                        source={{ html: HTML }}
                        androidHardwareAccelerationDisabled={true}
                        onLoad={() => setLoaded(true)}
                    />
                    {data && !hideExpand && <TouchableRipple
                        style={{ position: 'absolute', top: 0, right: 10, borderRadius: 4, padding: 6, backgroundColor: colors.UNICORN_SILVER }}
                        onPress={() => navigation.navigate('chart', { chartData: { data } })}>
                        <MaterialCommunityIcons name={'arrow-expand'} size={20} color={colors.PHILIPPINE_ORANGE}/>
                    </TouchableRipple>}
                </>}
        </View>
    </View>;
};

const HTML = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n' +
    '    <link rel="icon" href="../favicon.png"/>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Chart</title>\n' +
    '\n' +
    '</head>\n' +
    '<body style=\'margin: 0\'>\n' +
    '<div class=\'container\'>\n' +
    '    <div id=\'chart\' class=\'chartDoc\'></div>\n' +
    '</div>\n' +
    '<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>\n' +
    '<script src="https://momentjs.com/downloads/moment.js"></script>\n' +
    '<script>\n' +
    '\n' +
    '    function getOptions({ dataSeries, times, name, divNumber, timeType }) {\n' +
    '        return {\n' +
    '            series: [\n' +
    '                {\n' +
    '                    name: (name && divNumber) ? `${name} (${divNumber.unit})` : \'\',\n' +
    '                    data: dataSeries || []\n' +
    '                },\n' +
    '            ],\n' +
    '            chart: {\n' +
    '                type: (timeType && timeType.chartType) || \'line\',\n' +
    '                toolbar: {\n' +
    '                    show: false,\n' +
    '                    offsetY: 10,\n' +
    '                    offsetX: -10,\n' +
    '                    tools: {\n' +
    '                        download: false,\n' +
    '                        selection: false,\n' +
    '                        zoom: false,\n' +
    '                        zoomin: false,\n' +
    '                        zoomout: false,\n' +
    '                        pan: false,\n' +
    '                        reset: false,\n' +
    '                        customIcons: [{\n' +
    '                            icon: \'<i class="fas fa-expand-alt"/>\',\n' +
    '                            index: 0,\n' +
    '                            title: \'tooltip of the icon\',\n' +
    '                            class: \'custom-icon\'\n' +
    '                        }]\n' +
    '                    }\n' +
    '                },\n' +
    '                selection: {\n' +
    '                    enabled: false\n' +
    '                }\n' +
    '            },\n' +
    '            dataLabels: {\n' +
    '                enabled: false\n' +
    '            },\n' +
    '            colors: [\'#ff7300\'],\n' +
    '            fill: {\n' +
    '                type: \'solid\',\n' +
    '                colors: [\'#ff7300\']\n' +
    '            },\n' +
    '            stroke: {\n' +
    '                show: true,\n' +
    '                ...((timeType && timeType.stroke) || { width: 0 })\n' +
    '            },\n' +
    '            plotOptions: {\n' +
    '                bar: {\n' +
    '                    horizontal: false,\n' +
    '                    borderRadius: 3,\n' +
    '                    columnWidth: \'70%\',\n' +
    '                    distributed: false,\n' +
    '                    rangeBarOverlap: true,\n' +
    '                    rangeBarGroupRows: false,\n' +
    '                }\n' +
    '            },\n' +
    '            grid: {\n' +
    '                show: true,\n' +
    '                position: \'back\',\n' +
    '                borderColor: \'rgba(154,154,154,0.28)\',\n' +
    '                xaxis: {\n' +
    '                    lines: {\n' +
    '                        show: false\n' +
    '                    }\n' +
    '                },\n' +
    '                yaxis: {\n' +
    '                    lines: {\n' +
    '                        show: true\n' +
    '                    }\n' +
    '                },\n' +
    '            },\n' +
    '            xaxis: {\n' +
    '                show: true,\n' +
    '                // type: \'number\',\n' +
    '                categories: times,\n' +
    '                tickAmount: 4,\n' +
    '                axisTicks: {\n' +
    '                    show: false,\n' +
    '                },\n' +
    '                axisBorder: {\n' +
    '                    show: false,\n' +
    '                },\n' +
    '                labels: {\n' +
    '                    show: true,\n' +
    '                    rotate: 0,\n' +
    '                    style: {\n' +
    '                        colors: \'rgba(154,154,154,0.57)\',\n' +
    '                        fontSize: \'11px\',\n' +
    '                    },\n' +
    '                    // rotate: 0,\n' +
    '                    formatter: (value) => {\n' +
    '                        return moment(new Date(value)).format((timeType && timeType.timeFormatChart) ? timeType.timeFormatChart : \'D/M\');\n' +
    '                    },\n' +
    '                },\n' +
    '            },\n' +
    '            yaxis: {\n' +
    '                show: true,\n' +
    '                tickAmount: 1,\n' +
    '                labels: {\n' +
    '                    show: true,\n' +
    '                    style: {\n' +
    '                        colors: \'rgba(154,154,154,0.57)\',\n' +
    '                        fontSize: \'11px\',\n' +
    '                    },\n' +
    '                    formatter: (value) => value,\n' +
    '                },\n' +
    '            },\n' +
    '            tooltip: {\n' +
    '                enabled: true,\n' +
    '                x: {\n' +
    '                    show: false,\n' +
    '                    formatter: (index) => {\n' +
    '                        return timeType ? moment(times[index]).format(timeType.timeFormatTable) : \'\';\n' +
    '                    },\n' +
    '                },\n' +
    '                y: {\n' +
    '                    formatter: (value) => {\n' +
    '                        return value + \' \' + (divNumber && divNumber.unit);\n' +
    '                    },\n' +
    '                    title: {\n' +
    '                        formatter: () => \'\',\n' +
    '                    },\n' +
    '                },\n' +
    '            },\n' +
    '            legend: {\n' +
    '                show: true,\n' +
    '                showForSingleSeries: true,\n' +
    '                position: \'top\',\n' +
    '                horizontalAlign: \'left\',\n' +
    '                fontSize: \'12px\',\n' +
    '                offsetX: 0,\n' +
    '                markers: {\n' +
    '                    width: 7,\n' +
    '                    height: 7\n' +
    '                },\n' +
    '                onItemClick: {\n' +
    '                    toggleDataSeries: false\n' +
    '                },\n' +
    '                onItemHover: {\n' +
    '                    highlightDataSeries: false\n' +
    '                }\n' +
    '            }\n' +
    '        };\n' +
    '    }\n' +
    '\n' +
    '    window.loadChart = (data) => {\n' +
    '        if (window.chart) {\n' +
    '            window.chart.updateOptions(getOptions(data));\n' +
    '        }\n' +
    '    };\n' +
    '\n' +
    '    function onLoad() {\n' +
    '        const chart = new ApexCharts(document.querySelector(\'#chart\'), getOptions({}));\n' +
    '        window.chart = chart;\n' +
    '        chart.render();\n' +
    '    }\n' +
    '\n' +
    '    document.addEventListener(\'DOMContentLoaded\', function () {\n' +
    '        onLoad();\n' +
    '    });\n' +
    '</script>\n' +
    '</body>\n' +
    '</html>';

export default WebChart;
