import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';


import './siteBadge.scss';

const SiteBadge = ({ site, onClick }) => {

    const infoDom = useMemo(() => {
        if (site?.isFail) {
            return <>
                <p className='siteSubInfo'>Đang xảy ra sự cố</p>
                <p className='siteSubInfo'>{`Thời gian sự cố: ${Math.floor(site.duration * 10) / 10} giờ`}</p>
            </>;
        } else if (site) {
            return <>
                <p className='siteSubInfo'>{`Thời gian hoạt động: ${Math.floor(site.duration * 10) / 10} giờ`}</p>
                <p className='siteSubInfo'>{`Tổng sản lượng điện: ${Math.floor(site.product * 10) / 10} kWh`}</p>
            </>;
        }
    }, [site]);

    return <Container className={classNames('siteBadge', { fail: site?.isFail })} onClick={e => {
        e.preventDefault();
        onClick(site);
    }}>
        <Row>
            <Col xs={3} className='avatar'>
                <i className='fas fa-solar-panel'/>
            </Col>
            <Col xs={9} className='siteDetail'>
                <Row className='siteName'>
                    <p>{site?.name}</p>
                </Row>
                <Row className='siteInfo'>
                    {infoDom}
                </Row>
            </Col>
        </Row>
        <div className='status'/>
    </Container>;
};

export default SiteBadge;
