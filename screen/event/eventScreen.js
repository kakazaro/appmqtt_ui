import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import AppBarLayout from '../../component/appBarLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import utility from '../../common/utility';
import RowInfo from '../../component/rowInfo/rowInfo';
import { colors } from '../../common/themes';
import moment from 'moment';
import SiteContext from '../../context/siteContext';

const EventScreen = ({ navigation, route }) => {
    const siteContext = useContext(SiteContext);

    const eventItem = useMemo(() => route?.params?.event, [route]);

    return <AppBarLayout title={'Sự kiện'}>
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
                            value: moment(eventItem?.timestamp).format('YYYY-MM-DD, HH:mm:ss')
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'Trạng thái',
                            value: <Text style={{ fontSize: 18, color: eventItem?.eventStatus?.color }}>{eventItem?.eventStatus?.label}</Text>
                        },
                        sub: {
                            text: 'Thời gian hoàn thành',
                            value: eventItem?.completed_at ? moment(eventItem?.completed_at).format('YYYY-MM-DD, HH:mm:ss') : '(Chưa có)'
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'Trạm điện chịu ảnh hưởng',
                            value: <TouchableOpacity activeOpacity={1} onPress={() => {
                                if (eventItem?.showSite) {
                                    navigation.navigate('site', { site: { id: eventItem?.siteId, name: eventItem?.siteName } });
                                }
                            }}>
                                <Text style={{ fontSize: 18, color: eventItem?.showSite ? colors.FADING_NIGHT : colors.primaryText }}>{eventItem?.siteName}</Text>
                            </TouchableOpacity>,
                            unit: eventItem?.showSite ? <MaterialCommunityIcons style={{ color: colors.FADING_NIGHT }} size={12} name={'open-in-new'}/> : undefined
                        }
                    }}/>
                    <RowInfo info={{
                        main: {
                            text: 'Thiết bị chịu ảnh hưởng',
                            value: <TouchableOpacity activeOpacity={1} onPress={() => {
                                if (eventItem?.showDevice) {
                                    siteContext.updateSite({ id: eventItem?.siteId, name: eventItem?.siteName });
                                    navigation.navigate('device', { device: { id: eventItem?.deviceId, name: eventItem?.deviceName } });
                                }
                            }}>
                                <Text style={{ fontSize: 18, color: eventItem?.showDevice ? colors.FADING_NIGHT : colors.primaryText }}>{eventItem?.deviceName}</Text>
                            </TouchableOpacity>,
                            unit: eventItem?.showDevice ? <MaterialCommunityIcons style={{ color: colors.FADING_NIGHT }} size={12} name={'open-in-new'}/> : undefined
                        }
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
