import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import constant from '../../common/constant';
import { colors } from '../../common/themes';
import UserContext from '../../context/userContext';
import utility from '../../common/utility';

const InfoTab = ({ navigation }) => {
    const userContext = useContext(UserContext);

    const roleUser = useMemo(() => utility.USER_ROLES[Object.keys(utility.USER_ROLES).find(k => k === userContext?.user?.role)], [userContext]);

    return <View style={styles.container}>
        <ScrollView>
            <View>
                <Text style={styles.sectionText}>Thông tin người dùng:</Text>
                <View style={{ marginStart: 15, marginTop: 5, marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', marginEnd: 8 }}>
                            <Text style={styles.labelText}>Email:</Text>
                            <Text style={styles.labelText}>Tên:</Text>
                            {userContext.rolePermission.showUserType && <Text style={styles.labelText}>Tài khoản:</Text>}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.infoText}>{userContext?.user?.email}</Text>
                            <Text style={styles.infoText}>{userContext?.user?.name}</Text>
                            {userContext.rolePermission.showUserType && <Text style={styles.infoText}>{roleUser.label}</Text>}
                        </View>
                    </View>
                </View>
                <Divider/>
            </View>
            <View>
                <Text style={styles.sectionText}>Liên hệ để yêu cầu cấp quyền truy cập:</Text>
                <View style={{ marginStart: 15, marginTop: 5, marginBottom: 5 }}>
                    <Text style={{ ...styles.infoText, fontSize: 14, marginBottom: 4 }}>{constant.CONTACT_INFO.corp}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', marginEnd: 8 }}>
                            <Text style={styles.labelText}>Địa chỉ:</Text>
                            <Text style={styles.labelText}>Điện thoại:</Text>
                            <Text style={styles.labelText}>Email:</Text>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.infoText}>{constant.CONTACT_INFO.address}</Text>
                            <Text style={styles.infoText}>{constant.CONTACT_INFO.phone}</Text>
                            <Text style={styles.infoText}>{constant.CONTACT_INFO.email}</Text>
                        </View>
                    </View>
                </View>
                <Divider/>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Button
                    mode={'contained'}
                    style={{ backgroundColor: colors.PHILIPPINE_ORANGE }}
                    labelStyle={{ textTransform: 'none' }}
                    onPress={() => navigation.navigate('share')}
                >
                    Chia Sẻ Ứng Dụng
                </Button>
            </View>
        </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sectionText: {
        marginStart: 10, marginTop: 15, color: colors.PHILIPPINE_ORANGE, fontSize: 15, marginBottom: 1
    },
    labelText: {
        color: colors.secondaryText,
        fontSize: 12
    },
    infoText: {
        color: colors.primaryText,
        fontSize: 12,
    }
});

export default InfoTab;
