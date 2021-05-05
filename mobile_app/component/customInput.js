import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { colors } from '../common/themes';
import { View } from 'react-native';

const CustomInput = React.forwardRef((props, ref) => {
    const themeInput = { colors: { primary: colors.PHILIPPINE_ORANGE, text: colors.primaryText, underlineColor: 'transparent' } };
    return <View style={{ width: '100%' }}>
        <TextInput
            ref={ref}
            theme={themeInput}
            mode={'outlined'}
            dense={true}
            {...props}
        />
        {!!props.error && <HelperText type='error'>
            {props.error}
        </HelperText>}
    </View>;
});

export default CustomInput;
