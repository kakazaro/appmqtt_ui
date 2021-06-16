import React, { useEffect, useState } from 'react';
import { Button, Dialog, HelperText, Portal, Text } from 'react-native-paper';
import { colors } from '../common/themes';

const ConfirmDialog = ({ show, title, content, dismissible = true, onClose, loading = false, onOk, negativeText, positiveText = 'Có', isNegative, error = '', mode = 'contained', countDown = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let timer;
        if (show) {
            setCount(countDown);
            timer = setInterval(() => {
                setCount(lastCount => lastCount > 0 ? (lastCount - 1) : 0);
            }, 1000);
        }

        return function () {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [show]);

    return <Portal>
        <Dialog visible={!!show} dismissable={dismissible} onDismiss={onClose}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
                {typeof content === 'string' ? <Text>{content}</Text> : content}
                {!!error && <HelperText type='error' visible={!!error}>
                    {error}
                </HelperText>}
            </Dialog.Content>
            <Dialog.Actions>
                {negativeText !== '' && <Button disabled={loading} onPress={onClose} style={{ marginEnd: onOk ? 15 : 0 }} labelStyle={!loading ? { color: colors.primaryText } : {}}>{negativeText || 'Không'}</Button>}
                {onOk && <Button disabled={loading || count} mode={mode} loading={loading} onPress={onOk}
                                 contentStyle={{
                                     backgroundColor: (mode === 'contained' && !loading && !count) ? (isNegative ? colors.seekerColor : colors.PHILIPPINE_ORANGE) : undefined,
                                     minWidth: 80
                                 }}
                                 labelStyle={(mode !== 'contained' && !loading && !count) ? { color: (isNegative ? colors.seekerColor : colors.PHILIPPINE_ORANGE) } : {}}
                >{`${positiveText}${(count > 0 ? ` (${count})` : '')}`}</Button>}
            </Dialog.Actions>
        </Dialog>
    </Portal>;
};

export default ConfirmDialog;
