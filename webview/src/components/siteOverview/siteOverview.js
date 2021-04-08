import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Container, Col, Row } from 'react-bootstrap';
import utility from '../../service/utility';
import SiteChart from '../siteChart/siteChart';
import { Button } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';

import './siteOverview.scss';
import axios from '../../service/axios';

const timeTypes = [
    {
        id: 'day',
        label: 'Ngày',
        views: ['year', 'month', 'date'],
        format: '[ngày] D MMMM [năm] YYYY',
        notes: 24,
    },
    {
        id: 'month',
        label: 'Tháng',
        views: ['year', 'month'],
        format: 'MMMM [năm] YYYY',
        notes: 30,
    },
    {
        id: 'year',
        label: 'Năm',
        views: ['year'],
        format: '[năm] YYYY',
        notes: 12,
    },
];

const SiteOverview = ({ data }) => {
    const [timeType, setTimeType] = useState(timeTypes[0]);
    const [time, setTime] = useState(new Date());

    const product = useMemo(() => data ? Math.floor(data.product * 100) / 100 : 0, [data]);
    const income = useMemo(() => data ? data.product * 2000 : 0, [data]);
    const [dataChart, setDataChart] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const t = new Date(time);
                let d = '' + t.getFullYear() + t.getMonth() + t.getDay();
                const response = await axios.get(`/chart?notes=${encodeURIComponent(timeType.notes)}&time=${encodeURIComponent(d)}`);
                setDataChart(response.data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [timeType, time]);

    if (!data) {
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
                    clearable
                    disableFuture
                    views={timeType.views}
                />
            </Row>
            <Row className={'product'}>
                <Col xs={6}>
                    <p><span className={'unit'}>kWh</span> <span className={'value'}>{product}</span></p>
                    <p className={'description'}>Điện sản xuất</p>
                </Col>
                <Col xs={6}>
                    <p><span className={'unit'}>đ</span> <span className={'value'}>{utility.makeupMoney(income)}</span></p>
                    <p className={'description'}>Thu nhập</p>
                </Col>
            </Row>
            <Row className={'chartPower'}>
                <SiteChart title={'Sản lượng điện'} unit={''} data={dataChart}/>
            </Row>
        </Col>
    </Container>;
};

export default SiteOverview;
