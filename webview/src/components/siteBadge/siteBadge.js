import React, { useMemo } from 'react';
import CustomBadge from '../common/customBadge';

import './siteBadge.scss';

const SiteBadge = ({ site, onClick }) => {

    const infoDom = useMemo(() => {
        if (site?.isFail) {
            return <>
                <p className="siteSubInfo">Đang xảy ra sự cố</p>
                <p className="siteSubInfo">{`Thời gian sự cố: ${Math.floor(site.duration * 10) / 10} giờ`}</p>
            </>;
        } else if (site) {
            return <>
                <p className="siteSubInfo">{`Thời gian hoạt động: ${Math.floor(site.duration * 10) / 10} giờ`}</p>
                <p className="siteSubInfo">{`Tổng sản lượng điện: ${Math.floor(site.product * 10) / 10} kWh`}</p>
            </>;
        }
    }, [site]);

    return <CustomBadge
        className
        onClick={() => onClick(site)}
        header={site?.name}
        avatar={<i className="fas fa-solar-panel"/>}
        info={infoDom}
    />;
};

export default SiteBadge;
