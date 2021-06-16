import React, { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import ConfirmDialog from './confirmDialog';

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
        <ConfirmDialog
            title={'Phiên bản cập nhật mới'}
            content={'Bạn có muốn cập nhật ứng dụng không?'}
            show={show && !discard}
            dismissible={false}
            onOk={update}
            onClose={() => setDiscard(true)}
            isNegative={false}
        />
    </>;
};

export default UpdateWrap;
