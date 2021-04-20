import React, { useMemo } from 'react';
import classNames from 'classnames';
import CustomBadge from '../customBadge';
import utility from '../../../service/utility';
import { Col, Row } from 'react-bootstrap';
import { Cancel, Warning } from '@material-ui/icons';
import moment from 'moment';

import './eventBadge.scss';

const EventBadge = ({ event, onClick }) => {

    const infoDom = useMemo(() => {
        const statusId = event?.status;
        let key = Object.keys(utility.EVENT_STATUS).find(key => utility.EVENT_STATUS[key].id === statusId);
        const status = key ? utility.EVENT_STATUS[key] : undefined;

        const typeId = event?.eventType;
        key = Object.keys(utility.EVENT_TYPE).find(key => utility.EVENT_TYPE[key].id === typeId);
        const type = key ? utility.EVENT_TYPE[key] : undefined;

        let stateDom;

        if (status && type) {
            stateDom = <Row>
                <Col className={'typeCol'}>
                    {type.id === utility.EVENT_TYPE.ALARM.id && <Warning className={'alarm'}/>}
                    {type.id === utility.EVENT_TYPE.FAULT.id && <Cancel className={'fault'}/>}
                    {type.label}
                </Col>
                <Col className={classNames('statusCol', status.id.toLowerCase())}>
                    {status.label}
                </Col>
            </Row>;
        }

        return <>
            <p>{moment(event.time).format('YYYY-MM-DD HH:mm')}</p>
            {stateDom}
        </>;
    }, [event]);

    return <CustomBadge
        className={classNames('eventBadge')}
        onClick={() => onClick(event)}
        header={event?.caption}
        avatar={<></>}
        info={infoDom}
    />;
};

export default EventBadge;
