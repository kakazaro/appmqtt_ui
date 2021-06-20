import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const IotDeviceBadge = ({ item }) => {
    const navigation = useNavigation();

    const onPress = () => {
        if (item) {
            navigation.navigate('iot', { iot: item });
        }
    };

    if (!item) {
        return null;
    }

    return <TouchableRipple onPress={onPress}>
        <View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingStart: 15, paddingEnd: 15, paddingTop: 15, backgroundColor: 'white' }}>
                <View style={{ minWidth: 20 }}>
                    <MaterialCommunityIcons style={{ marginTop: 7 }} name={'checkbox-blank-circle'} size={12} color={colors.normal}/>
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: 'bold', marginBottom: 5 }}>{item.name || ''}</Text>
                    <Text style={[styles.subText]}>Thiết bị IOT</Text>
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

export default IotDeviceBadge;
