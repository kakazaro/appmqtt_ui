import React, { useEffect, useState } from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { colors } from '../common/themes';
import { View } from 'react-native';

const CustomInput = React.forwardRef((props, ref) => {
    const [text, setText] = useState('');
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init && props.isDialog) {
            setInit(true);
            setText(props.value);
        }
    }, [props.value]);

    useEffect(() => {
        if (props.isDialog) {
            props.onChangeText(text);
        }
    }, [text]);

    const themeInput = { colors: { primary: colors.PHILIPPINE_ORANGE, text: colors.primaryText, underlineColor: 'transparent' } };
    return <View style={{ width: '100%' }}>
        {!props.isDialog && <TextInput
            ref={ref}
            theme={themeInput}
            mode={'outlined'}
            dense={true}
            {...props}
        />}
        {props.isDialog && <TextInput
            ref={ref}
            theme={themeInput}
            mode={'outlined'}
            dense={true}
            {...props}
            value={text}
            onChangeText={text => setText(text)}
        />}
        {!!props.error && <HelperText type='error'>
            {props.error}
        </HelperText>}
    </View>;
});

export default CustomInput;
