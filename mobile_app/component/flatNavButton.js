import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';

const FlatNavButton = ({ title, style, onPress }) => {
    return <View style={[style, { width: '100%' }]}>
        <TouchableRipple style={{ padding: 15 }} onPress={() => {
            if (onPress) {
                onPress();
            }
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1, color: colors.primaryText, fontSize: 15 }}>
                    {title}
                </Text>
                <MaterialCommunityIcons name={'chevron-right'} size={24} color={colors.primaryText}/>
            </View>
        </TouchableRipple>
    </View>;
};

export default FlatNavButton;
