import React, { useEffect, useState } from 'react';
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

    if (!eventsData?.length) {
        return null;
    }

    return <div className={'siteEvent'}>
        {eventsData.map((event, index) => <EventBadge event={event} key={index} onClick={() => {
        }}/>)}
    </div>;
};

export default SiteEvent;
