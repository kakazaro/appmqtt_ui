import React from 'react';
import classNames from 'classnames';
import { Navbar, Container, Row } from 'react-bootstrap';

import './freshestLayout.scss';

const FreshestLayout = ({ title, className, children }) => {
    return <Container fluid className={classNames('mainLayout freshestLayout', className)}>
        <Row xs={12}>
            <Navbar expand="lg" bg="dark" variant="dark">
                <Navbar.Brand>
                    {title || 'Home'}
                </Navbar.Brand>
            </Navbar>
        </Row>
        <Row className={'layoutBody'}>
            {children}
        </Row>
    </Container>;
};

export default FreshestLayout;
