import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import utility from '../../common/utility';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    ShineOverlay
} from 'rn-placeholder';

const DeviceBadge = ({ item }) => {
    const navigation = useNavigation();

    const infoDom = useMemo(() => {
        const device = item;
        if (!device) {
            return <Placeholder Animation={ShineOverlay}>
                <PlaceholderLine width={(Math.random() * 40 + 40)} height={22} noMargin={true} style={{ marginBottom: 5 }}/>
                <PlaceholderLine width={(Math.random() * 40 + 20)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
            </Placeholder>;
        }

        const curActPower = utility.makeupPower(device.curActPower || 0);
        const todayEnergy = utility.makeupProduct(device.todayEnergy || 0);

        return <>
            <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: 'bold', marginBottom: 5 }}>{device.name}</Text>
            <Text style={styles.subText}>{`Công suất hiện tại: ${curActPower.value} ${curActPower.unit}`}</Text>
            <Text style={[styles.subText, { marginBottom: 5 }]}>{`Sản lượng điện trong ngày: ${todayEnergy.value} ${todayEnergy.unit}`}</Text>
        </>;
    }, [item]);

    const onPress = () => {
        if (item) {
            navigation.navigate('device', { device: item });
        }
    };

    return <TouchableRipple onPress={onPress}>
        <View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingStart: 15, paddingEnd: 15, paddingTop: 15, backgroundColor: 'white' }}>
                <View style={{ minWidth: 20 }}>
                    {item ?
                        <MaterialCommunityIcons style={{ marginTop: 7 }} name={'checkbox-blank-circle'} size={12} color={colors[item.status?.toLowerCase()] || colors.offline}/>
                        :
                        <Placeholder Animation={ShineOverlay}>
                            <PlaceholderMedia size={12} style={{ marginTop: 7 }}/>
                        </Placeholder>
                    }
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {infoDom}
                    <Divider/>
                </View>
            </View>
        </View>
    </TouchableRipple>;
};

const styles = StyleSheet.create({
    subText: {
        fontSize: 13, color: colors.secondaryText
    }
});

export default DeviceBadge;
