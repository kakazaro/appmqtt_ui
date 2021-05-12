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
    const navigation = useNavigation();

    const user = useMemo(() => item, [item]);
    const roleUser = useMemo(() => utility.USER_ROLES[Object.keys(utility.USER_ROLES).find(k => k === user?.role)], [user]);

    const infoDom = useMemo(() => {
        if (!user) {
            return <Placeholder Animation={ShineOverlay}>
                <PlaceholderLine width={(Math.random() * 40 + 40)} height={18} noMargin={true} style={{ marginBottom: 5 }}/>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={14} noMargin={true} style={{ marginBottom: 3 }}/>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={11} noMargin={true} style={{ marginBottom: 3 }}/>
            </Placeholder>;
        }

        const { name } = user;

        return <>
            <Text style={{ fontSize: 16, color: colors.PHILIPPINE_ORANGE, fontWeight: 'bold', marginBottom: 0 }}>{user?.email}</Text>
            <Text style={{ fontSize: 15, color: colors.primaryText, marginBottom: 0 }}>{name}</Text>
            <Text style={{ fontSize: 11, color: colors.secondaryText, marginBottom: 5 }}>{roleUser?.label}</Text>
        </>;

    }, [user, roleUser]);

    const onPress = () => {
        if (user) {
            navigation.navigate('user', { user });
        }
    };

    return <TouchableRipple onPress={onPress}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 15, paddingTop: 5, marginBottom: 1, backgroundColor: 'white' }}>
            <View style={{ minWidth: 55, justifyContent: 'center', alignItems: 'center' }}>
                {roleUser ?
                    <MaterialCommunityIcons name={roleUser.icon} size={50} color={colors.PHILIPPINE_ORANGE}/>
                    :
                    <Placeholder Animation={ShineOverlay}>
                        <PlaceholderMedia size={50}/>
                    </Placeholder>
                }
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {infoDom}
            </View>
            <Divider/>
        </View>
    </TouchableRipple>;
};

export default UserBadge;
