import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import AppBarLayout from '../component/appBarLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import utility from '../common/utility';
import RowInfo from '../component/rowInfo/rowInfo';
import { colors } from '../common/themes';
import moment from 'moment';

const EventScreen = ({ route }) => {
    const eventItem = useMemo(() => route?.params?.event, [route]);

    return <AppBarLayout title={'Sự cố'}>
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }}>
                <View style={{ backgroundColor: 'white', width: '100%' }}>
                    <Headline style={{ margin: 0, paddingStart: 15, paddingEnd: 15 }}>{utility.getEventErrorName(eventItem?.error)}</Headline>
                </View>
                <View>
                    <RowInfo info={{
                        main: {
                            text: 'Loại',
                            value: <>
                                <Text style={{ fontSize: 18, color: colors.primaryText }}>{eventItem?.eventType?.label}</Text>
                                <MaterialCommunityIcons style={{ marginStart: 5, marginTop: 3 }} name={eventItem?.eventType?.icon} size={18} color={eventItem?.eventType?.color}/>
                            </>,
                        },
                        sub: {
                            text: 'Thời gian xảy ra',
                            value: moment(eventItem?.timestamp).format('YYYY-MM-DD, HH:mm:ss[.]SSS')
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'Trạng thái',
                            value: <>
                                <Text style={{ fontSize: 18, color: eventItem?.eventStatus?.color }}>{eventItem?.eventStatus?.label}</Text>
                            </>,
                        },
                        sub: {
                            text: 'Thời gian hoàn thành',
                            value: eventItem?.completed_at ? moment(eventItem?.completed_at).format('YYYY-MM-DD, HH:mm:ss[.]SSS') : '(Chưa có)'
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'Trạm điện chịu ảnh hưởng',
                            value: <>
                                <Text style={{ fontSize: 18, color: colors.primaryText }}>{eventItem?.siteName}</Text>
                            </>,
                        },
                        // sub: {
                        //     text: 'Chi tiết',
                        //     value: <TouchableRipple onPress={() => console.log('here')}><Text style={{ color: colors.PHILIPPINE_ORANGE, fontStyle: 'italic' }}>truy cập trạm điện</Text></TouchableRipple>
                        // }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'Thiết bị chịu ảnh hưởng',
                            value: <>
                                <Text style={{ fontSize: 18, color: colors.primaryText }}>{eventItem?.deviceName}</Text>
                            </>,
                        },
                        // sub: {
                        //     text: 'Chi tiết',
                        //     value: <TouchableRipple onPress={() => console.log('here')}><Text style={{ color: colors.PHILIPPINE_ORANGE, fontStyle: 'italic' }}>truy cập thiết bị</Text></TouchableRipple>
                        // }
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


export default EventScreen;
