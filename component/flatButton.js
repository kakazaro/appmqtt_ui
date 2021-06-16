import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';

const FlatButton = ({ title, style, description, currentValue, onPress, iconName, disabled, titleStyle, valueStyle, iconStyle, iconColor }) => {
    return <View style={[style, { width: '100%' }]}>
        <TouchableRipple style={{ padding: 15 }} onPress={disabled || !onPress ? undefined : onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={[{ color: colors.primaryText, fontSize: 15 }, titleStyle]}>{title}</Text>
                    {description && <Text style={{ color: colors.secondaryText, fontSize: 11 }}>{description}</Text>}
                </View>
                {currentValue && <Text style={[{ color: colors.secondaryText, fontSize: 13, marginEnd: 10 }, valueStyle]}>{currentValue}</Text>}
                {!!iconName && <MaterialCommunityIcons name={iconName} size={24} color={disabled ? colors.DARK_SOULS : (iconColor || colors.primaryText)} style={iconStyle}/>}
            </View>
        </TouchableRipple>
    </View>;
};

export default FlatButton;
