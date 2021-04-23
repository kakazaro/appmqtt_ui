import React, { useContext, useEffect, useMemo, useState } from 'react';
import EventBadge from '../badge/eventBadge/eventBadge';
import UserContext from '../userContext/userContext';
import axios from '../../service/axios';
import FreshestLayout from '../layout/freshestLayout';

import './globalEvent.scss';

const GlobalEvent = () => {
    const userContext = useContext(UserContext);
    const [eventsData, setEventsData] = useState();
    const token = useMemo(() => userContext?.token, [userContext]);

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    const response = await axios.get('site/events', {
                        headers: {
                            token
                        }
                    });
                    setEventsData(response.data.events);
                } catch (err) {
                    console.error(err);
                }
            })();
        }
    }, [token]);

    if (!eventsData?.length) {
        return null;
    }

    // return <div className={'globalEvent'}>
    //
    // </div>;

    return <FreshestLayout className="globalEvent" title={'Sự cố các trạm điện'}>
        <div className="eventBody">
            {eventsData.map(event => <EventBadge event={event} onClick={() => {
            }}/>)}
        </div>
    </FreshestLayout>;
};

export default GlobalEvent;
