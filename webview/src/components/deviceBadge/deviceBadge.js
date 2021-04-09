import React, { useMemo } from 'react';
import CustomBadge from '../common/customBadge';

import './deviceBadge.scss';

const DeviceBadge = ({ device, onClick }) => {

    const infoDom = useMemo(() => {
        if (device?.isFail) {
            return <>
                <p className="siteSubInfo">Đang xảy ra sự cố</p>
                <p className="siteSubInfo">{`Thời gian sự cố: ${Math.floor(device.duration * 10) / 10} giờ`}</p>
            </>;
        } else if (device) {
            return <>
                <p className="siteSubInfo">{`Thời gian hoạt động: ${Math.floor(device.duration * 10) / 10} giờ`}</p>
                <p className="siteSubInfo">{`Tổng sản lượng điện: ${Math.floor(device.product * 10) / 10} kWh`}</p>
            </>;
        }
    }, [device]);

    return <CustomBadge
        className
        onClick={() => onClick(device)}
        header={device?.name}
        avatar={<i className="fas fa-charging-station"/>}
        info={infoDom}
        isFail={device?.isFail}
    />;
};

export default DeviceBadge;
