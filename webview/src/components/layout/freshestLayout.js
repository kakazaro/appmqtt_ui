import React from 'react';
import classNames from 'classnames';
import { Navbar, Container, Row } from 'react-bootstrap';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import './freshestLayout.scss';

const FreshestLayout = ({ title, className, children, canBack }) => {
    return <Container fluid className={classNames('mainLayout freshestLayout', className)}>
        <Row xs={12}  className={'headerLayout'}>
            {canBack && <ArrowBackIcon onClick={() => {
                window.history.back();
            }}/>}
            <Navbar expand="lg">
                <Navbar.Brand>
                    {title}
                </Navbar.Brand>
                <Navbar.Collapse className={'justify-content-end'}>

                </Navbar.Collapse>
            </Navbar>
        </Row>
        <Row className={'layoutBody'}>
            {children}
        </Row>
    </Container>;
};

export default FreshestLayout;
