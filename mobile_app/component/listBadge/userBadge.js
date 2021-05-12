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

const UserBadge = ({ item }) => {
    // const navigation = useNavigation();

    const roleUser = useMemo(() => utility.USER_ROLES[Object.keys(utility.USER_ROLES).find(k => k === item?.role)], [item]);

    const infoDom = useMemo(() => {
        const user = item;
        if (!user) {
            return <Placeholder Animation={ShineOverlay}>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={14} noMargin={true} style={{ marginBottom: 3 }}/>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
            </Placeholder>;
        }

        const { name } = user;

        return <>
            <Text style={{ fontSize: 15, color: colors.primaryText, marginBottom: 3 }}>{name}</Text>
            <Text style={styles.subText}>{roleUser?.label}</Text>
        </>;

    }, [item, roleUser]);

    const onPress = () => {
        if (item) {
            // navigation.navigate('site', { site: item });
        }
    };

    return <TouchableRipple onPress={onPress}>
        <View>
            <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingStart: 15, paddingEnd: 15, paddingTop: 10, marginBottom: 1, backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ minWidth: 40 }}>
                        {roleUser ?
                            <MaterialCommunityIcons name={roleUser.icon} size={32} color={colors.PHILIPPINE_ORANGE}/>
                            :
                            <Placeholder Animation={ShineOverlay}>
                                <PlaceholderMedia size={34}/>
                            </Placeholder>
                        }
                    </View>
                    {item?.email ?
                        <Text style={{ fontSize: 18, color: colors.PHILIPPINE_ORANGE, fontWeight: 'bold', marginBottom: 2 }}>{item?.email}</Text>
                        :
                        <Placeholder Animation={ShineOverlay}>
                            <PlaceholderLine width={(Math.random() * 40 + 40)} height={18} noMargin={true} style={{ marginBottom: 5 }}/>
                        </Placeholder>
                    }
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {infoDom}
                </View>
                <Divider/>
            </View>
        </View>
    </TouchableRipple>;
};

const styles = StyleSheet.create({
    subText: {
        fontSize: 13, color: colors.secondaryText
    }
});

export default UserBadge;
