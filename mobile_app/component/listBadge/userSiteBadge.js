import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Divider, RadioButton, Text } from 'react-native-paper';
import { colors } from '../../common/themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    Placeholder,
    PlaceholderLine,
    ShineOverlay
} from 'rn-placeholder';

const UserSiteBadge = ({ item, onPress, isAddSite }) => {
    const site = useMemo(() => item, [item]);

    return <View onPress={() => {
        if (typeof isAddSite === 'boolean') {
            onPress();
        }
    }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingEnd: 15, paddingTop: 10, paddingBottom: 10, marginBottom: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, justifyContent: 'center', marginStart: 15 }}>
                {site ?
                    <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: 'bold', marginBottom: 0 }}>{site?.name}</Text>
                    :
                    <Placeholder Animation={ShineOverlay}>
                        <PlaceholderLine width={(Math.random() * 40 + 40)} height={16} noMargin={true} style={{ marginBottom: 5 }}/>
                    </Placeholder>
                }
            </View>
            <View style={{ justifyContent: 'center' }}>
                {site && typeof isAddSite !== 'boolean' && <MaterialCommunityIcons onPress={onPress} name={'trash-can-outline'} size={24} color={colors.REDDISH}/>}
                {site && typeof isAddSite === 'boolean' && <RadioButton value={site._id} color={colors.PHILIPPINE_ORANGE} status={isAddSite ? 'checked' : 'unchecked'}/>}
            </View>
            <Divider/>
        </View>
    </View>;
};

export default UserSiteBadge;
