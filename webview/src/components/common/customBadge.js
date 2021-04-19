import React from 'react';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';

import './customBadge.scss';

const CustomBadge = ({ className, avatar, header, info, onClick }) => {
    return <Container className={classNames('customBadge', className)} onClick={e => {
        e.preventDefault();
        onClick();
    }}>
            <div className="badgeAvatar">
                {avatar}
            </div>
            <Col className="badgeBody">
                <Row className="header">
                    <p>{header}</p>
                </Row>
                <Row className="info">
                    {info}
                </Row>
            </Col>
    </Container>;
};

export default CustomBadge;
