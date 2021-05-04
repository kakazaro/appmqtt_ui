import React from 'react';
import utility from '../common/utility';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';

const StatusBanner = ({ statusId, title }) => {
    const key = Object.keys(utility.STATUS).find(key => utility.STATUS[key].id === statusId);
    const status = key ? utility.STATUS[key] : undefined;

    return <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'white', paddingTop: 8, paddingBottom: 8 }}>
        <View style={styles.statusView}>
            <Text style={styles.statusText}>
                {title}
            </Text>
        </View>
        <View style={styles.statusView}>
            {status && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'checkbox-blank-circle'} size={14} color={colors[status.id] || colors.offline}/>
                <Text style={[styles.statusText, { paddingStart: 5 }]}>{status.label}</Text>
            </View>}
        </View>
    </View>;
};

const styles = StyleSheet.create({
    statusView: {
        flex: 1,
        alignItems: 'center'
    },
    statusText: {
        fontSize: 13,
        color: colors.secondaryText
    },
});


export default StatusBanner;
