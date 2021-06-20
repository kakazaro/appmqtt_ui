import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import AppBarLayout from '../../component/appBarLayout';
import RowInfo from '../../component/rowInfo/rowInfo';
import { colors } from '../../common/themes';

const IotScreen = ({ route }) => {

    const iot = useMemo(() => route?.params?.iot, [route]);

    return <AppBarLayout>
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }}>
                <View style={{ backgroundColor: 'white', width: '100%' }}>
                    <Headline style={{ margin: 0, paddingStart: 15, paddingEnd: 15 }}>{iot?.name}</Headline>
                </View>
                <View>
                    <RowInfo info={{
                        main: {
                            text: 'Tên trạm điện',
                            value: iot?.site_name,
                        },
                        sub: {
                            text: 'DHCP',
                            value: <>
                                <Text style={{ fontSize: 14, color: iot?.dhcp_enable ? colors.normal : colors.fault }}>{iot?.dhcp_enable ? 'Bật' : 'Tắt'}</Text>
                            </>
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'IP address',
                            value: iot?.ip_address
                        },
                        sub: [
                            (iot?.default_gateway ? {
                                text: 'Default gateway',
                                value: iot?.default_gateway
                            } : undefined),
                            (iot?.subnet_mask ? {
                                text: 'Subnet mask',
                                value: iot?.subnet_mask
                            } : undefined),
                            (iot?.dns ? {
                                text: 'DNS',
                                value: iot?.dns
                            } : undefined),
                        ]
                    }}/>

                </View>
            </ScrollView>
        </View>
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
});


export default IotScreen;
