import React, { useContext } from 'react';
import classNames from 'classnames';
import { Navbar, Container, Row } from 'react-bootstrap';
import { ArrowBack, PowerSettingsNew } from '@material-ui/icons';
import UserContext from '../userContext/userContext';

import './freshestLayout.scss';

const FreshestLayout = ({ title, className, children, canBack }) => {
    const userContext = useContext(UserContext);

    return <Container fluid className={classNames('mainLayout freshestLayout', className)}>
        <Row xs={12} className={'headerLayout'}>
            {canBack && <ArrowBack onClick={() => {
                window.history.back();
            }}/>}
            <Navbar expand="lg">
                <Navbar.Brand>
                    {title}
                </Navbar.Brand>
                <Navbar.Collapse className={classNames({ 'show': userContext.token })}>
                    <PowerSettingsNew onClick={() => userContext.logout()}/>
                </Navbar.Collapse>
            </Navbar>
        </Row>
        <Row className={'layoutBody'}>
            {children}
        </Row>
    </Container>;
};

export default FreshestLayout;
