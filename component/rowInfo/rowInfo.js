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
                    {(typeof info.main.value === 'string' || typeof info.main.value === 'number') && <Text style={{ fontSize: 22, color: colors.primaryText }}>{info.main.value}</Text>}
                    {typeof info.main.value === 'object' && info.main.value}

                    {(typeof info.main.unit === 'string' || typeof info.main.unit === 'number') && <Text style={{ fontSize: 15, color: colors.primaryText, marginStart: 3 }}>{info.main.unit}</Text>}
                    {typeof info.main.unit === 'object' && info.main.unit}
                </View>}
        </View>
        {info.sub && <>
            <Divider/>
            {(Array.isArray(info.sub) ? info.sub : [info.sub]).filter((sub) => !!sub).map((sub, index) => <View key={index} style={{ flexDirection: 'row', marginTop: 8 }}>
                <View>
                    <Text style={{ fontSize: 13, color: colors.secondaryText }}>
                        {sub.text}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    {sub.value === undefined ?
                        <Placeholder Animation={ShineOverlay}>
                            <PlaceholderLine width={20} height={15} noMargin={true} style={{ marginStart: '80%' }}/>
                        </Placeholder>
                        :
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                            {(typeof sub.value === 'string' || typeof sub.value === 'number') && <Text style={{ color: colors.secondaryText }}>{sub.value}</Text>}
                            {typeof sub.value === 'object' && sub.value}

                            {(typeof sub.unit === 'string' || typeof sub.unit === 'number') && <Text style={{ color: colors.secondaryText, paddingStart: 3 }}>{sub.unit}</Text>}
                            {typeof sub.unit === 'object' && sub.unit}
                        </View>}
                </View>
            </View>)}
        </>}
    </View>;
};

export default RowInfo;
