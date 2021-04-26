import React, { useMemo } from 'react';
import CustomBadge from '../customBadge';
import utility from '../../../service/utility';
import './deviceBadge.scss';
import classNames from 'classnames';
import { Skeleton } from '@material-ui/lab';

import './deviceBadge.scss';

const DeviceBadge = ({ device, onClick }) => {

    const infoDom = useMemo(() => {
        if (!device) {
            return <>
                <Skeleton height={15} width={(Math.random() * 30 + 50) + '%'}/>
                <Skeleton height={15} width={(Math.random() * 30 + 50) + '%'}/>
            </>;
        }
        const curActPower = utility.makeupPower(device.curActPower || 0);
        const todayEnergy = utility.makeupProduct(device.todayEnergy || 0);

        return <>
            <p className="siteSubInfo">{`Công suất hiện tại: ${curActPower.value} ${curActPower.unit}`}</p>
            <p className="siteSubInfo">{`Sản lượng điện trong ngày: ${todayEnergy.value} ${todayEnergy.unit}`}</p>
        </>;
    }, [device]);

    return <CustomBadge
        className={'deviceBadge'}
        onClick={() => onClick(device)}
        header={device ? device.name : <Skeleton height={30} width={(Math.random() * 40 + 50) + '%'}/>}
        avatar={device ? (<div className={classNames('deviceAvatar', (device.status || '').toLowerCase())}/>)
            : <Skeleton variant={'circle'} width={20} height={20} style={{ marginTop: 10, marginRight: 5 }}/>}
        info={infoDom}
        isFail={device?.isFail}
    />;
};

export default DeviceBadge;
