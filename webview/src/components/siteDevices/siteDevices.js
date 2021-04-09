import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import siteService from '../../service/siteService';
import CircularBar from '../circularBar/circularBar';
import { buildStyles } from 'react-circular-progressbar';
import { Container } from 'react-bootstrap';

import './siteDevices.scss';

const SiteDevices = ({ siteId, onGaugeChange }) => {
    const [devicesData, setDevicesData] = useState();

    useEffect(() => {
        if (siteId) {
            const handle = (data) => setDevicesData(data);
            siteService.registerSiteData(siteId, 'devices', handle, 15000);

            return () => {
                siteService.unRegisterSiteData(siteId, 'devices');
            };
        }
    }, [siteId]);

    useEffect(() => {
        const dom = null;
        // const dom = <CircularBar value={siteOverviewData ? siteOverviewData.current / siteOverviewData.max : 0} styles={buildStyles({
        //     pathColor: '#317ad4'
        // })}>
        //     <div className={'innerBarWatt'}>
        //         {siteOverviewData && <p className={'description'}>Công xuất</p>}
        //         <p className={'currentPower'}>{siteOverviewData ? Math.floor(siteOverviewData.current * 10) / 10 : '- -'}</p>
        //         {siteOverviewData && <p className={'unitPower'}>Watt</p>}
        //     </div>
        // </CircularBar>;
        onGaugeChange(dom);
    }, [devicesData, onGaugeChange]);

    if (!devicesData?.length) {
        return null;
    }

    return <Container className={'siteDevices'}>
    </Container>;
};

export default SiteDevices;
