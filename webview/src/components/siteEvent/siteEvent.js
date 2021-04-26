import React, { useEffect, useMemo, useState } from 'react';
import siteService from '../../service/siteService';
import { navigate } from '@reach/router';

import './siteEvent.scss';
import EventBadge from '../badge/eventBadge/eventBadge';

const SiteEvent = ({ site }) => {
    const [eventsData, setEventsData] = useState();

    useEffect(() => {
        if (site) {
            const handle = (data) => setEventsData(data.events);
            const registerId = siteService.registerSiteData(site.id, 'events', handle, {
                id: site.id
            }, 30000);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        } else {
            navigate('/');
        }
    }, [site]);

    const dom = useMemo(() => {
        if (!eventsData) {
            return Array(15).fill('').map((v, index) => <EventBadge key={index} onClick={() => {
            }}/>);
        } else if (!eventsData.length) {
            return <p className={'noData'}>Hiện chưa có dữ liệu để hiển thị.</p>;
        }

        return eventsData.map((event, index) => <EventBadge event={event} key={index} onClick={() => {
        }}/>);
    }, [eventsData]);

    return <div className={'siteEvent'}>
        {dom}
    </div>;
};

export default SiteEvent;
