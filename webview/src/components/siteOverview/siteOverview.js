import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Container, Col, Row } from 'react-bootstrap';
import utility from '../../service/utility';
import SiteChart from '../siteChart/siteChart';
import { Button } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import siteService from '../../service/siteService';
import CircularBar from '../circularBar/circularBar';
import { buildStyles } from 'react-circular-progressbar';
import { navigate } from '@reach/router';

import './siteOverview.scss';
import moment from 'moment';

const timeTypes = [
    {
        id: 'day',
        label: 'Ngày',
        views: ['year', 'month', 'date'],
        format: '[ngày] D MMMM [năm] YYYY',
        notes: 24,
        start: 'd',
        space: 'h',
        timeFormatChart: 'H[h]',
        timeFormatTable: 'H [giờ]',
    },
    {
        id: 'month',
        label: 'Tháng',
        views: ['year', 'month'],
        format: 'MMMM [năm] YYYY',
        notes: 30,
        start: 'M',
        space: 'd',
        timeFormatChart: 'D',
        timeFormatTable: '[ngày] D',
    },
    {
        id: 'year',
        label: 'Năm',
        views: ['year'],
        format: '[năm] YYYY',
        notes: 12,
        start: 'y',
        space: 'M',
        timeFormatChart: 'M',
        timeFormatTable: '[tháng] MM',
    },
];

const SiteOverview = ({ siteId, onGaugeChange }) => {
    const [siteOverviewData, setSiteOverviewData] = useState();
    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());

    const product = useMemo(() => siteOverviewData ? Math.floor(siteOverviewData.product * 100) / 100 : 0, [siteOverviewData]);
    const income = useMemo(() => siteOverviewData ? siteOverviewData.product * 1871 : 0, [siteOverviewData]);
    const dataChart = useMemo(() => siteOverviewData?.chart, [siteOverviewData]);

    useEffect(() => {
        if (siteId) {
            const handle = (data) => setSiteOverviewData(data);
            let m = moment(time);
            const registerId = siteService.registerSiteData(siteId, 'overview', handle, {
                time: m.toDate().getTime(),
                space: timeType.space,
                start: timeType.start,
                notes: timeType.notes
            });

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        }
    }, [siteId, timeType, time]);

    useEffect(() => {
        const dom = <CircularBar value={siteOverviewData ? siteOverviewData.current / siteOverviewData.max : 0} styles={buildStyles({
            pathColor: '#317ad4',
        })}>
            <div className={'innerBarWatt'}>
                {siteOverviewData && <p className={'description'}>Công xuất</p>}
                <p className={'currentPower'}>{siteOverviewData ? Math.floor(siteOverviewData.current * 10) / 10 : '- -'}</p>
                {siteOverviewData && <p className={'unitPower'}>Watt</p>}
            </div>
        </CircularBar>;
        onGaugeChange(dom);
    }, [siteOverviewData, onGaugeChange]);

    if (!siteOverviewData) {
        return null;
    }

    return <Container className={'siteOverview'}>
        <Col>
            <Row className={'timeTypeSelect'}>
                {timeTypes.map((type) => <Col key={type.id} xs={12 / timeTypes.length}>
                    <Button
                        className={classNames({ active: type.id === timeType.id })}
                        onClick={() => setTimeType(type)}>
                        {type.label}
                    </Button>
                </Col>)}
            </Row>
            <Row className={'timePick'}>
                <DatePicker
                    value={time} onChange={(t) => setTime(t)}
                    format={timeType.format}
                    autoOk
                    // clearable
                    // disableFuture
                    views={timeType.views}
                />
            </Row>
            <Row className={'product'}>
                <Col xs={6}>
                    <p><span className={'unit'}>{utility.makeupProduct(product).unit}</span> <span className={'value'}>{utility.makeupProduct(product).value}</span></p>
                    <p className={'description'}>Điện sản xuất</p>
                </Col>
                <Col xs={6}>
                    <p><span className={'unit'}>đ</span> <span className={'value'}>{utility.makeupMoney(income)}</span></p>
                    <p className={'description'}>Thu nhập</p>
                </Col>
            </Row>
            <Row className={'chartPower'}>
                <SiteChart title={'Sản lượng điện'} data={dataChart} timeType={timeType} onClick={() => {
                    navigate('/site/chart', { state: { dataChart, timeType, title: 'Sản lượng điện', date: time } });
                }}/>
            </Row>
        </Col>
    </Container>;
};

export default SiteOverview;
