import React from 'react';
import { ScrollView, View } from 'react-native';
import { List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/themes';
import FlatNavButton from '../component/flatNavButton';

const LANGUAGE = [
    {
        title: 'Tiếng Việt',
    },
    {
        title: 'English',
        description: 'coming soon',
        disabled: true
    }
];

const APP_SETTING = [
    {
        title: 'Thông tin ứng dụng',
        onPress: (navigation) => navigation.navigate('about')
    },
    {
        title: 'Đổi mật khẩu',
        onPress: (navigation) => {
        }
    }
];

const SettingScreen = ({ navigation }) => {

    return <ScrollView>
        <View style={{ marginTop: 10, backgroundColor: 'white' }}>
            <List.AccordionGroup>
                <List.Accordion title='Ngôn ngữ' id='1' titleStyle={{ fontSize: 15, color: colors.primaryText }}>
                    {LANGUAGE.map((lang, index) => <List.Item
                        key={index}
                        title={lang.title}
                        right={() => <>{!lang.disabled && <MaterialCommunityIcons name={'check-circle'} size={20} color={colors.PHILIPPINE_ORANGE} style={{ marginEnd: 20 }}/>}</>}
                        description={lang.description}
                        style={{ marginStart: 10, borderTopStyle: 'solid', borderTopWidth: 1, borderTopColor: colors.UNICORN_SILVER }}
                        titleStyle={{ fontSize: 13, color: lang.disabled ? colors.DARK_SOULS : colors.primaryText }}
                        descriptionStyle={{ fontSize: 11 }}
                    />)}
                </List.Accordion>
            </List.AccordionGroup>
        </View>
        <View style={{ marginTop: 10, backgroundColor: 'white' }}>
            {APP_SETTING.map((setting, index) => <FlatNavButton
                key={index}
                title={setting.title}
                style={{ borderTopStyle: 'solid', borderTopWidth: index ? 1 : 0, borderTopColor: colors.UNICORN_SILVER }}
                onPress={() => setting.onPress(navigation)}
            />)}
        </View>
    </ScrollView>;
};


export default SettingScreen;
