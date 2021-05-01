import React, { useMemo } from 'react';
import { StyleSheet, Image, View } from 'react-native';
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

const SiteBadge = ({ item }) => {
    const navigation = useNavigation();

    const siteInfoDom = useMemo(() => {
        const site = item;
        if (!site) {
            return <Placeholder Animation={ShineOverlay}>
                <PlaceholderLine width={(Math.random() * 40 + 40)} height={18} noMargin={true} style={{ marginBottom: 5 }}/>
                <PlaceholderLine width={(Math.random() * 40 + 20)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
                <PlaceholderLine width={(Math.random() * 50 + 50)} height={12} noMargin={true} style={{ marginBottom: 3 }}/>
            </Placeholder>;
        }

        const statusId = site.status;
        const key = Object.keys(utility.STATUS).find(key => utility.STATUS[key].id === statusId);
        let status = key ? utility.STATUS[key] : undefined;

        return <>
            <Text style={{ fontSize: 18, color: colors.primaryText, fontWeight: 600, marginBottom: 5 }}>{site.name}</Text>
            {status && <View style={{ flexDirection: 'row' }}>
                <Text style={styles.subText}>Trạng thái: </Text>
                <MaterialCommunityIcons name={'checkbox-blank-circle'} size={12} color={colors[status.id] || colors.offline}/>
                <Text style={[styles.subText, { marginStart: 3 }]}>{status.label}</Text>
                {typeof site.noStatus === 'number' && typeof site.noTotal === 'number' && <Text style={[styles.subText, { marginStart: 2 }]}>{`(${site.noStatus}/${site.noTotal})`}</Text>}
            </View>}
            <Text style={styles.subText}>{`Thời gian hoạt động: ${Math.floor(site.workingHours * 10) / 10} giờ`}</Text>
            <Text style={[styles.subText, { marginBottom: 5 }]}>{`Tổng sản lượng điện: ${utility.makeupProduct(site.product).value} ${utility.makeupProduct(site.product).unit}`}</Text>
        </>;

    }, [item]);

    const onPress = () => {
        if (item) {
            navigation.navigate('site', { screen: 'siteOverview', site: item, params: { site: item } });
        }
    };

    return <TouchableRipple onPress={onPress}>
        <View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'start', alignItems: 'start', paddingStart: 15, paddingEnd: 15, paddingTop: 15, backgroundColor: 'white' }}>
                <View style={{ marginEnd: 10 }}>
                    {item ?
                        <Image style={{ width: 34, height: 34, borderRadius: 5 }} source={require('../../assets/picture/solar.jpg')}/>
                        :
                        <Placeholder Animation={ShineOverlay}>
                            <PlaceholderMedia size={34}/>
                        </Placeholder>
                    }
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {siteInfoDom}
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

export default SiteBadge;
