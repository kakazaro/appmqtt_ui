import React, { useMemo } from 'react';
import classNames from 'classnames';
import CustomBadge from '../customBadge';
import solarImg from '../../../asset/picture/solar.jpg';
import utility from '../../../service/utility';
import { Skeleton } from '@material-ui/lab';

import './siteBadge.scss';

const SiteBadge = ({ site, onClick }) => {

    const infoDom = useMemo(() => {
        if (!site) {
            return <>
                <Skeleton height={15} width={(Math.random() * 30 + 50) + '%'}/>
                <Skeleton height={15} width={(Math.random() * 30 + 50) + '%'}/>
                <Skeleton height={15} width={(Math.random() * 30 + 50) + '%'}/>
            </>;
        }

        const statusId = site.status;
        const key = Object.keys(utility.STATUS).find(key => utility.STATUS[key].id === statusId);
        let status = key ? utility.STATUS[key] : undefined;

        return <>
            {status && <p>
                Trạng thái: <span className={classNames('statusIndicate', (status?.id || '').toLowerCase())}/>
                <span>{status.label}</span>
                {typeof site.noStatus === 'number' && typeof site.noTotal === 'number' && <span>{`(${site.noStatus}/${site.noTotal})`}</span>}
            </p>}
            <p>{`Thời gian hoạt động: ${Math.floor(site.workingHours * 10) / 10} giờ`}</p>
            <p>{`Tổng sản lượng điện: ${utility.makeupProduct(site.product).value} ${utility.makeupProduct(site.product).unit}`}</p>
        </>;
    }, [site]);

    return <CustomBadge
        className={classNames('siteBadge', (site?.status || '').toLowerCase())}
        onClick={() => onClick(site)}
        header={site ? site.name : <Skeleton height={30} width={(Math.random() * 50 + 30) + '%'}/>}
        avatar={site ? <img src={solarImg} alt={'solar'}/> : <Skeleton width={35} height={55} style={{ marginTop: -8 }}/>}
        info={infoDom}
    />;
};

export default SiteBadge;
