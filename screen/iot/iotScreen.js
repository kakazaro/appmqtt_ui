import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import AppBarLayout from '../../component/appBarLayout';
import RowInfo from '../../component/rowInfo/rowInfo';
import { colors } from '../../common/themes';
import Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

const IotScreen = ({ route }) => {

    const iot = useMemo(() => route?.params?.iot, [route]);

    return <AppBarLayout>
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', width: '100%', paddingStart: 15, paddingEnd: 15, paddingBottom: 5, alignItems: 'center' }}>
                    <Headline style={{ flex: 1, margin: 0, color: colors.PHILIPPINE_ORANGE }}>{iot?.name}</Headline>
                    {!!iot?.id && <TouchableOpacity style={{ backgroundColor: colors.UNICORN_SILVER, padding: 5, borderRadius: 5 }}
                                                    onPress={() => {
                                                        Clipboard.setString(iot.id);
                                                        Toast.show('Đã copy ID IOT vào clipboard', { duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM, shadow: true, animation: true, hideOnPress: true, delay: 0 });
                                                    }}>
                        <Text style={{ color: colors.secondaryText, fontSize: 12 }}>Copy ID</Text>
                    </TouchableOpacity>}
                </View>
                <View>
                    <RowInfo info={{
                        main: {
                            text: 'Tên trạm điện', value: iot?.site_name,
                        }, sub: {
                            text: 'DHCP', value: <>
                                <Text style={{ fontSize: 14, color: iot?.dhcp_enable ? colors.normal : colors.fault }}>{iot?.dhcp_enable ? 'Bật' : 'Tắt'}</Text>
                            </>
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'IP address', value: iot?.ip_address
                        }, sub: [(iot?.default_gateway ? {
                            text: 'Default gateway', value: iot?.default_gateway
                        } : undefined), (iot?.subnet_mask ? {
                            text: 'Subnet mask', value: iot?.subnet_mask
                        } : undefined), (iot?.dns ? {
                            text: 'DNS', value: iot?.dns
                        } : undefined),]
                    }}/>

                </View>
            </ScrollView>
        </View>
    </AppBarLayout>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1, width: '100%'
    },
});


export default IotScreen;
