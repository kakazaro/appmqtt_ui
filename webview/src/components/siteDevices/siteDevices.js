import React, { useEffect, useMemo, useState } from 'react';
import siteService from '../../service/siteService';
import DeviceBadge from '../badge/deviceBadge/deviceBadge';
import { navigate } from '@reach/router';

import './siteDevices.scss';

const SiteDevices = ({ site }) => {
    const [devicesData, setDevicesData] = useState();

    useEffect(() => {
        if (site) {
            const handle = (data) => setDevicesData(data.devices);
            const registerId = siteService.registerSiteData(site.id, 'devices', handle, undefined, 15000);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        } else {
            navigate('/');
        }
    }, [site]);

    const dom = useMemo(() => {
        if (!devicesData) {
            return Array(10).fill('').map((v, index) => <DeviceBadge key={index} onClick={() => {
            }}/>);
        } else if (!devicesData.length) {
            return <p className={'noData'}>Hiện chưa có dữ liệu để hiển thị.</p>;
        }

        return devicesData.map((device, index) => <DeviceBadge key={index} device={device} onClick={() => {
        }}/>);
    }, [devicesData]);

    return <div className={'siteDevices'}>
        {dom}
    </div>;
};

export default SiteDevices;
