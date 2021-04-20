import React, { useMemo } from 'react';
import classNames from 'classnames';
import CustomBadge from '../customBadge';
import solarImg from '../../../asset/picture/solar.jpg';
import utility from '../../../service/utility';

import './siteBadge.scss';

const SiteBadge = ({ site, onClick }) => {

    const infoDom = useMemo(() => {
        const statusId = site?.status;
        const key = Object.keys(utility.STATUS).find(key => utility.STATUS[key].id === statusId);
        let status = key ? utility.STATUS[key] : undefined;

        return <>
            {status && <p>
                Trạng thái: <span className={classNames('statusIndicate', (status?.id || '').toLowerCase())}/>
                <span>{status.label}</span>
                {typeof site?.noStatus === 'number' && typeof site?.noTotal === 'number' && <span>{`(${site?.noStatus}/${site?.noTotal})`}</span>}
            </p>}
            <p>{`Thời gian hoạt động: ${Math.floor(site.workingHours * 10) / 10} giờ`}</p>
            <p>{`Tổng sản lượng điện: ${utility.makeupProduct(site.product).value} ${utility.makeupProduct(site.product).unit}`}</p>
        </>;
    }, [site]);

    return <CustomBadge
        className={classNames('siteBadge', (site?.status || '').toLowerCase())}
        onClick={() => onClick(site)}
        header={site?.name}
        avatar={<img src={solarImg} alt={'solar'}/>}
        info={infoDom}
    />;
};

export default SiteBadge;
