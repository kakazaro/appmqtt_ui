import { View, TouchableOpacity } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import { Placeholder, PlaceholderLine, ShineOverlay } from 'rn-placeholder';
import React, { useMemo, useState } from 'react';

const RowInfo = ({ info }) => {
    const [isExpand, setIsExpand] = useState(false);

    const mainDom = useMemo(() => {
        if (!info.details || !isExpand) {
            // If show the main info
            if (info.main.value === undefined) {
                // Loading
                return <Placeholder Animation={ShineOverlay}>
                    <PlaceholderLine width={30} height={30} noMargin={true} style={{ marginStart: '70%' }}/>
                </Placeholder>;
            }
            // Show main
            return <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                {(typeof info.main.value === 'string' || typeof info.main.value === 'number') && <Text style={{ fontSize: 22, color: colors.primaryText }}>{info.main.value}</Text>}
                {typeof info.main.value === 'object' && info.main.value}

                {(typeof info.main.unit === 'string' || typeof info.main.unit === 'number') && <Text style={{ fontSize: 15, color: colors.primaryText, marginStart: 3 }}>{info.main.unit}</Text>}
                {typeof info.main.unit === 'object' && info.main.unit}
            </View>;
        } else {
            // If show detail info
            return <View style={{ marginStart: '10%', marginTop: 5 }}>
                {info.details.map((detail, index) => <View key={index} style={{ flexDirection: 'row', marginBottom: detail.isSum ? 0 : 5, width: '100%' }}>
                    <Text style={{ flex: 1, fontSize: detail.isSum ? 15 : 13, fontWeight: detail.isSum ? 'bold' : 'normal', color: detail.isSum ? colors.primaryText : colors.secondaryText }}>
                        {detail.text}
                    </Text>
                    {detail.value === undefined && <View style={{ minWidth: (Math.random() * 30 + 40) }}>
                        <Placeholder Animation={ShineOverlay}>
                            <PlaceholderLine width={100} height={18} noMargin={true}/>
                        </Placeholder>
                    </View>}
                    {detail.value !== undefined && <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                        {(typeof detail.value === 'string' || typeof detail.value === 'number') && <Text style={{ fontSize: detail.isSum ? 15 : 13, fontWeight: detail.isSum ? 'bold' : 'normal', color: detail.isSum ? colors.primaryText : colors.secondaryText }}>{detail.value}</Text>}
                        {typeof detail.value === 'object' && detail.value}

                        {(typeof detail.unit === 'string' || typeof detail.unit === 'number') && <Text style={{ fontSize: detail.isSum ? 15 : 13, color: detail.isSum ? colors.primaryText : colors.secondaryText, marginStart: 3 }}>{detail.unit}</Text>}
                        {typeof detail.unit === 'object' && detail.unit}
                    </View>}
                </View>)}
            </View>;
        }
    }, [info, isExpand]);

    return <View style={{ backgroundColor: 'white', width: '100%', marginTop: 5, paddingTop: 10, paddingBottom: 5, paddingStart: 15, paddingEnd: 15 }}>
        <TouchableOpacity activeOpacity={1} style={{ marginBottom: 5 }} onPress={() => setIsExpand(l => !l)}>
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: colors.primaryText }}>
                    {info.main.text}
                </Text>
                {info.details !== undefined && <Text style={{ fontSize: 12, color: colors.PHILIPPINE_ORANGE }}>
                    {isExpand ? 'thu gọn' : 'xem chi tiết'}
                </Text>}
            </View>
            {mainDom}
        </TouchableOpacity>
        {info.sub && <>
            <Divider/>
            {(Array.isArray(info.sub) ? info.sub : [info.sub]).filter((sub) => !!sub).map((sub, index) => <View key={index} style={{ flexDirection: 'row', marginTop: 8 }}>
                <View>
                    <Text style={{ fontSize: 13, color: colors.secondaryText }}>
                        {sub.text}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    {sub.value === undefined ? <Placeholder Animation={ShineOverlay}>
                        <PlaceholderLine width={20} height={15} noMargin={true} style={{ marginStart: '80%' }}/>
                    </Placeholder> : <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
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
