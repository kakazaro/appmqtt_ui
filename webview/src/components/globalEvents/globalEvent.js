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

    const dom = useMemo(() => {
        if (!eventsData) {
            return Array(30).fill('').map((v, index) => <EventBadge key={index} onClick={() => {
            }}/>);
        } else if (!eventsData.length) {
            return <p className={'noData'}>Hiện chưa có dữ liệu để hiển thị.</p>;
        }

        return eventsData.map(event => <EventBadge event={event} onClick={() => {
        }}/>);
    }, [eventsData]);

    return <FreshestLayout className="globalEvent" title={'Sự cố các trạm điện'}>
        <div className="eventBody">
            {dom}
        </div>
    </FreshestLayout>;
};

export default GlobalEvent;
