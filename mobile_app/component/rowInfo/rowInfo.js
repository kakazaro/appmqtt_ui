import { View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import { Placeholder, PlaceholderLine, ShineOverlay } from 'rn-placeholder';
import React from 'react';

const RowInfo = ({ info }) => {
    return <View style={{ backgroundColor: 'white', width: '100%', marginTop: 5, paddingTop: 10, paddingBottom: 5, paddingStart: 15, paddingEnd: 15 }}>
        <View style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 14, color: colors.primaryText }}>
                {info.main.text}
            </Text>
            {info.main.value === undefined ?
                <Placeholder Animation={ShineOverlay}>
                    <PlaceholderLine width={30} height={30} noMargin={true} style={{ marginStart: '70%' }}/>
                </Placeholder>
                :
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                    {typeof info.main.value === 'string' && <Text style={{ fontSize: 22, color: colors.primaryText }}>{info.main.value}</Text>}
                    {typeof info.main.value === 'object' && info.main.value}
                    {info.main.unit && <Text style={{ fontSize: 15, color: colors.primaryText, marginStart: 3 }}>{info.main.unit}</Text>}
                </View>}
        </View>
        {info.sub && <>
            <Divider/>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View>
                    <Text style={{ fontSize: 13, color: colors.secondaryText }}>
                        {info.sub.text}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    {info.sub.value === undefined ?
                        <Placeholder Animation={ShineOverlay}>
                            <PlaceholderLine width={20} height={15} noMargin={true} style={{ marginStart: '80%' }}/>
                        </Placeholder>
                        :
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                            <Text style={{ color: colors.secondaryText }}>{info.sub.value}</Text>
                            {info.sub.unit && <Text style={{ color: colors.secondaryText, paddingStart: 3 }}>{info.sub.unit}</Text>}
                        </View>}
                </View>
            </View>
        </>}
    </View>;
};

export default RowInfo;
