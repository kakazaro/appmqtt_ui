import React from 'react';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';

import './customBadge.scss';

const CustomBadge = ({ className, avatar, isFail, header, info, onClick }) => {
    return <Container className={classNames('customBadge', className, { fail: isFail })} onClick={e => {
        e.preventDefault();
        onClick();
    }}>
        <Row>
            <Col xs={3} className="avatar">
                {avatar}
            </Col>
            <Col xs={9} className="badgeBody">
                <Row className="header">
                    <p>{header}</p>
                </Row>
                <Row className="info">
                    {info}
                </Row>
            </Col>
        </Row>
        <div className="status"/>
    </Container>;
};

export default CustomBadge;
