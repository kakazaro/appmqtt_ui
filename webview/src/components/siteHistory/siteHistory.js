import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import CircularBar from '../circularBar/circularBar';
import { buildStyles } from 'react-circular-progressbar';
import { Container } from 'react-bootstrap';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab';
import { Check, Close, Warning } from '@material-ui/icons';
import siteService from '../../service/siteService';
import moment from 'moment';

import './siteHistory.scss';

const SiteHistory = ({ siteId, onGaugeChange }) => {
    const [historyData, setHistoryData] = useState();

    useEffect(() => {
        if (siteId) {
            const handle = (data) => setHistoryData(data);
            const registerId = siteService.registerSiteData(siteId, 'history', handle, undefined, 30000);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        }
    }, [siteId]);


    useEffect(() => {
        let color = '#317ad4', status = '- -', code = 0;
        if (historyData?.length) {
            if (historyData[0].code === 1) {
                color = '#ff5e5e';
                status = 'Sự Cố';
                code = 1;
            } else if (historyData[0].code === 2) {
                color = '#f7891b';
                status = 'Nguy Cơ';
                code = 2;
            } else {
                status = 'Tốt';
            }
        }

        const dom = <CircularBar value={1} styles={buildStyles({
            pathColor: color,
        })}>
            <div className={'innerBarHistory'}>
                <p className={classNames({ fail: code === 1, warning: code === 2 })}>{status}</p>
            </div>
        </CircularBar>;
        onGaugeChange(dom);
    }, [historyData, onGaugeChange]);

    if (!historyData?.length) {
        return null;
    }

    return <Container className={'siteHistory'}>
        <Timeline align="alternate">
            {historyData.map((history, index) => <TimelineItem key={index}>
                <TimelineOppositeContent>
                    <div className={'historyTime'}>
                        {!history.timeStamp ? 'Hiện tại' : moment(history.timeStamp).format('HH:mm, [ngày] D, MMMM, YYYY')}
                    </div>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot className={classNames({ fail: history.code === 1, warning: history.code === 2 })}>
                        {history.code === 0 && <Check/>}
                        {history.code === 1 && <Warning/>}
                        {history.code === 2 && <Close/>}
                    </TimelineDot>
                    {(index + 1) !== historyData.length && <TimelineConnector/>}
                </TimelineSeparator>
                <TimelineContent>
                    <Container className={classNames('historyBadge', { fail: history.code === 1, warning: history.code === 2 })}>
                        <p className={'historyStatus'}>{history.status}</p>
                        <p className={'historyCause'}>{history.cause}</p>
                    </Container>
                </TimelineContent>
            </TimelineItem>)}
        </Timeline>
    </Container>;
};

export default SiteHistory;
