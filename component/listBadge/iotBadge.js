import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    Placeholder,
    PlaceholderLine,
    ShineOverlay
} from 'rn-placeholder';

const IotBadge = ({ item, onClick, isSetup }) => {
    const infoDom = useMemo(() => {
        if (!item) {
            return <Placeholder Animation={ShineOverlay}>
                <PlaceholderLine width={(Math.random() * 40 + 40)} height={22} noMargin={true} style={{ marginBottom: 5 }}/>
                <PlaceholderLine width={(Math.random() * 40 + 20)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
            </Placeholder>;
        }

        return <View style={{ opacity: (!item.site_id || isSetup) ? 1 : 0.3 }}>
            <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={(!item.site_id || isSetup) ? 'check-circle-outline' : 'close-circle-outline'} size={13} color={(!item.site_id || isSetup) ? colors.normal : colors.fault} style={{ marginRight: 5 }}/>
                <Text style={[styles.subText]}>{(!item.site_id || isSetup) ? 'Có thể chọn' : <>Đã được sử dụng ở: <Text style={{ color: colors.primaryText, fontWeight: 'bold' }}>{item.site_name}</Text></>}</Text>
            </View>
        </View>;
    }, [item]);

    const onPress = () => {
        if (onClick) {
            onClick(item);
        }
    };

    return <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white', marginBottom: 5 }}>
            {infoDom}
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    subText: {
        fontSize: 13, color: colors.secondaryText
    }
});

export default IotBadge;
