import React, { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './siteBadge.scss';

const SiteBadge = ({ site }) => {

    const infoDom = useMemo(() => {
        if (site?.isFail) {
            return <p className='troubleSite'>Đang xảy ra sự cố</p>;
        } else if (site) {
            return <>
                <p className='siteSubInfo'>{`Thời gian hoạt động: ${Math.floor(site.duration * 10) / 10} giờ`}</p>
                <p className='siteSubInfo'>{`Thời gian hoạt động: ${Math.floor(site.product * 10) / 10} kWh`}</p>
            </>;
        }
    }, [site]);

    return <Container className={'siteBadge'}>
        <Row>
            <Col xs={3}>
                <i className='fas fa-solar-panel'/>
            </Col>
            <Col xs={9}>
                <Row>
                    {site?.name}
                </Row>
                <Row>
                    {infoDom}
                </Row>
            </Col>
        </Row>
    </Container>;
};

export default SiteBadge;
