import React, { useMemo } from 'react';
import CustomBadge from '../customBadge';
import utility from '../../../service/utility';
import './deviceBadge.scss';
import classNames from 'classnames';

import './deviceBadge.scss';

const DeviceBadge = ({ device, onClick }) => {

    const infoDom = useMemo(() => {
        const curActPower = utility.makeupPower(device.curActPower);
        const todayEnergy = utility.makeupProduct(device.todayEnergy);

        return <>
            <p className="siteSubInfo">{`Công suất hiện tại: ${curActPower.value} ${curActPower.unit}`}</p>
            <p className="siteSubInfo">{`Sản lượng điện trong ngày: ${todayEnergy.value} ${todayEnergy.unit}`}</p>
        </>;
    }, [device]);

    return <CustomBadge
        className={'deviceBadge'}
        onClick={() => onClick(device)}
        header={device?.name}
        avatar={(<div className={classNames('deviceAvatar', (device?.status || '').toLowerCase())}/>)}
        info={infoDom}
        isFail={device?.isFail}
    />;
};

export default DeviceBadge;
