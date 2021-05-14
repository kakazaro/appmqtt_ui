import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import constant from '../../common/constant';
import { colors } from '../../common/themes';

const InfoTab = () => {
    return <View style={styles.container}>
        <View>
            <Text style={{ marginStart: 10, marginTop: 15, color: colors.PHILIPPINE_ORANGE, fontSize: 15 }}>Liên hệ để được cấp quyền truy cập:</Text>
            <View style={{ marginStart: 15, marginTop: 5, marginBottom: 5 }}>
                <Text style={styles.infoText}>Địa chỉ: {constant.CONTACT_INFO.address}</Text>
                <Text style={styles.infoText}>Điện thoại: {constant.CONTACT_INFO.phone}</Text>
                <Text style={styles.infoText}>Email: {constant.CONTACT_INFO.email}</Text>
            </View>
            <Divider/>
        </View>
        <View>

        </View>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    infoText: {
        color: colors.secondaryText,
        fontSize: 12
    }
});

export default InfoTab;
