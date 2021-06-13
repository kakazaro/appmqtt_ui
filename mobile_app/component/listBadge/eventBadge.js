import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import moment from 'moment';
import utility from '../../common/utility';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    ShineOverlay
} from 'rn-placeholder';

const EventBadge = ({ item, showSite, showDevice }) => {
    const navigation = useNavigation();

    const eventType = useMemo(() => {
        const type = item.eventType;
        const key = Object.keys(utility.EVENT_TYPE).find(key => utility.EVENT_TYPE[key].id === type);

        return key ? utility.EVENT_TYPE[key] : utility.EVENT_TYPE.ALARM;
    }, [item]);

    const eventStatus = useMemo(() => {
        const status = item.status;
        const key = Object.keys(utility.EVENT_STATUS).find(key => utility.EVENT_STATUS[key].id === status);

        return key ? utility.EVENT_STATUS[key] : utility.EVENT_STATUS.UNCONFIRMED;
    }, [item]);

    const onPress = () => {
        if (item) {
            navigation.navigate('event', { event: { ...item, eventType, eventStatus } });
        }
    };

    return <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingStart: 19 }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ marginTop: 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ paddingStart: 22 }}>{moment(item?.completed_at || item?.timestamp).format('HH:mm')}</Text>
                            <Text style={{ color: colors.DARK_SOULS, fontSize: 12, paddingTop: 2 }}>{moment(item?.completed_at || item?.timestamp).format(':ss')}</Text>
                        </View>
                        <View style={{ paddingStart: 20, borderLeftWidth: 2, borderLeftColor: eventStatus.color, paddingTop: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 13, color: eventType.color }}>{eventType.label}</Text>
                                <Text style={styles.subText}> - </Text>
                                <Text style={{ fontSize: 13, color: eventStatus.color }}>{eventStatus.label}</Text>
                            </View>
                            <Text style={{ fontSize: 15, color: colors.primaryText, fontWeight: 'bold', marginBottom: 2 }}>{utility.getEventErrorName(item?.error)}</Text>
                            {showSite && <Text style={{ fontSize: 13, color: colors.primaryText, marginBottom: 2 }}>{item?.siteName}</Text>}
                            {showDevice && <Text style={{ fontSize: 13, color: colors.primaryText, marginBottom: 2 }}>{item?.deviceName}</Text>}
                            <Divider style={{ marginTop: 5 }}/>
                        </View>
                    </View>
                </View>
                <MaterialCommunityIcons
                    style={{
                        position: 'absolute',
                        left: 10,
                        top: 0,
                        marginLeft: 0.5,
                        marginTop: 0
                    }}
                    name={eventType.icon}
                    size={18}
                    color={eventType.color}/>
            </View>
        </View>
    </TouchableOpacity>;
};

export const EventBadgePlaceholder = () => {
    return <View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingStart: 11, paddingEnd: 15, paddingTop: 2 }}>
            <View style={{ minWidth: 20 }}>
                <Placeholder Animation={ShineOverlay}>
                    <PlaceholderMedia size={18} style={{ marginTop: 0 }}/>
                </Placeholder>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', paddingStart: 10 }}>
                <Placeholder Animation={ShineOverlay}>
                    <PlaceholderLine width={(Math.random() * 35 + 10)} height={14} noMargin={true} style={{ marginBottom: 8 }}/>
                    <PlaceholderLine width={(Math.random() * 40 + 20)} height={13} noMargin={true} style={{ marginBottom: 5 }}/>
                    <PlaceholderLine width={(Math.random() * 60 + 30)} height={15} noMargin={true} style={{ marginBottom: 5 }}/>
                    <PlaceholderLine width={(Math.random() * 40 + 20)} height={13} noMargin={true} style={{ marginBottom: 5 }}/>
                </Placeholder>
                <Divider/>
            </View>
        </View>
    </View>;
};

const styles = StyleSheet.create({
    subText: {
        fontSize: 13, color: colors.secondaryText
    }
});

export default EventBadge;

