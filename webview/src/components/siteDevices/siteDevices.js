import React, { useEffect, useState } from 'react';
import siteService from '../../service/siteService';
import DeviceBadge from '../deviceBadge/deviceBadge';
import { navigate } from '@reach/router';

import './siteDevices.scss';

const SiteDevices = ({ site }) => {
    const [devicesData, setDevicesData] = useState();

    useEffect(() => {
        if (site) {
            const handle = (data) => setDevicesData(data);
            const registerId = siteService.registerSiteData(site.id, 'devices', handle, undefined, 15000);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        } else {
            navigate('/')
        }
    }, [site]);

    if (!devicesData?.length) {
        return null;
    }

    return <div className={'siteDevices'}>
        {devicesData.map((device, index) => <DeviceBadge key={index} device={device} onClick={() => {
        }}/>)}
    </div>;
};

export default SiteDevices;
