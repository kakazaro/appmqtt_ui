import React, { useMemo } from 'react';
import CustomBadge from '../common/customBadge';
import utility from '../../service/utility';

import './deviceBadge.scss';

const DeviceBadge = ({ device, onClick }) => {

    const infoDom = useMemo(() => {
        if (device?.isFail) {
            return <>
                <p className="siteSubInfo">{`Công suất hiện tại: ${Math.floor(device.current * 10) / 10} W`}</p>
                <p className="siteSubInfo">{`Thời gian sự cố: ${Math.floor(device.duration * 10) / 10} giờ trước`}</p>
            </>;
        } else if (device) {
            const product = utility.makeupProduct(device.product);
            return <>
                <p className="siteSubInfo">{`Công suất hiện tại: ${Math.floor(device.current * 10) / 10} W`}</p>
                <p className="siteSubInfo">{`Tổng sản lượng điện: ${product.value + product.unit}`}</p>
            </>;
        }
    }, [device]);

    return <CustomBadge
        className={'deviceBadge'}
        onClick={() => onClick(device)}
        header={device?.name}
        avatar={(<></>)}
        info={infoDom}
        isFail={device?.isFail}
    />;
};

export default DeviceBadge;
