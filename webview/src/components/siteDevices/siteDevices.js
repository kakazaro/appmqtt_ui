import React, { useEffect, useMemo, useState } from 'react';
import siteService from '../../service/siteService';
import CircularBar from '../circularBar/circularBar';
import { buildStyles } from 'react-circular-progressbar';
import { Container } from 'react-bootstrap';
import DeviceBadge from '../deviceBadge/deviceBadge';

import './siteDevices.scss';

const SiteDevices = ({ siteId, onGaugeChange }) => {
    const [devicesData, setDevicesData] = useState();

    useEffect(() => {
        if (siteId) {
            const handle = (data) => setDevicesData(data);
            const registerId = siteService.registerSiteData(siteId, 'devices', handle, undefined, 15000);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        }
    }, [siteId]);

    const okayDevices = useMemo(() => devicesData ? devicesData.filter(d => !d.isFail) : [], [devicesData]);
    const failDevices = useMemo(() => devicesData ? devicesData.filter(d => d.isFail) : [], [devicesData]);


    useEffect(() => {
        const dom = <CircularBar value={devicesData ? okayDevices?.length / devicesData.length : 0} styles={buildStyles({
            pathColor: '#317ad4',
            trailColor: '#ff5e5e',
        })}>
            <div className={'innerBarDevices'}>
                <p className={'okayDevices'}>{devicesData ? okayDevices.length : '- -'}<span className={'totalDevices'}>{devicesData ? ('/ ' + devicesData?.length) : ''}</span></p>
                {devicesData && <p className={'description'}>hoạt động</p>}
            </div>
        </CircularBar>;
        onGaugeChange(dom);
    }, [devicesData, okayDevices, failDevices, onGaugeChange]);

    if (!devicesData?.length) {
        return null;
    }

    return <Container className={'siteDevices'}>
        {devicesData.map((device, index) => <DeviceBadge key={index} device={device} onClick={() => {
        }}/>)}
    </Container>;
};

export default SiteDevices;
