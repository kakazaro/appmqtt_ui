import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { colors } from '../common/themes';

const FlatTextInput = ({ title, style }) => {
    return <View style={[style, { width: '100%' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: colors.primaryText, fontSize: 15 }}>
                {title}
            </Text>
            <TextInput style={{ backgroundColor: 'white' }}/>
        </View>
    </View>;
};

export default FlatTextInput;
