import React, { useEffect, useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { colors } from '../common/themes';
import * as Updates from 'expo-updates';

const UpdateWrap = ({ children }) => {
    const [show, setShow] = useState(false);
    const [discard, setDiscard] = useState(false);

    const checkNewUpdate = () => {
        (async () => {
            let recheckTime = 5 * 60 * 1000;
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    const fetch = await Updates.fetchUpdateAsync();
                    if (fetch.isNew) {
                        setShow(true);
                        recheckTime = 0;
                    }
                }
            } catch (e) {
                recheckTime = 30 * 1000;
            }

            if (recheckTime) {
                setTimeout(checkNewUpdate, recheckTime);
            }
        })();
    };

    const update = () => {
        setShow(false);
        (async () => {
            await Updates.reloadAsync();
        })();
    };

    useEffect(() => {
        checkNewUpdate();
    }, []);

    return <>
        {children}
        <Portal>
            <Dialog visible={show && !discard} dismissable={false}>
                <Dialog.Title>Phiên bản cập nhật mới</Dialog.Title>
                <Dialog.Content>
                    <Text>Bạn có muốn cập nhật ứng dụng không?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDiscard(true)} style={{ marginEnd: 15 }} labelStyle={{ color: colors.primaryText }}>Không</Button>
                    <Button mode={'contained'} onPress={update} style={{ backgroundColor: colors.PHILIPPINE_ORANGE, minWidth: 60 }}>Có</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    </>;
};

export default UpdateWrap;
