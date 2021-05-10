import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

const WebChart = ({ data }) => {
    const webRef = useRef(null);

    useEffect(() => {
        if (data && webRef && webRef.current) {
            try {
                console.log('here');
                // console.log(JSON.stringify(data));
                // webRef.current.injectJavaScript(`window.loadChart(${JSON.stringify(data)});true;`);
            } catch (e) {

            }
        }
    }, [data]);

    return <View style={{ height: 320 }}>
        <WebView
            ref={webRef}
            // originWhitelist={['*']}
            source={{ uri: 'http://10.40.50.61:3000/chart' }}
        />
    </View>;
};

export default WebChart;
