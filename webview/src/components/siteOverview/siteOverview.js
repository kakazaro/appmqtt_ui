import React, { useMemo } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import utility from '../../service/utility';
import SiteChart from '../siteChart/siteChart';

import './siteOverview.scss';

const SiteOverview = ({ data }) => {

    const product = useMemo(() => data ? Math.floor(data.product * 100) / 100 : 0, [data]);
    const income = useMemo(() => data ? data.product * 2000 : 0, [data]);

    if (!data) {
        return null;
    }

    return <Container className={'siteOverview'}>
        <Col>
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
                <SiteChart title={'Sản lượng điện'} unit={'kWh'}/>
            </Row>
        </Col>
    </Container>;
};

export default SiteOverview;
