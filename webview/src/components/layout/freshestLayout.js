import React, { useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Navbar, Container, Row, Button } from 'react-bootstrap';
import { ArrowBack, PowerSettingsNew } from '@material-ui/icons';
import UserContext from '../userContext/userContext';

import './freshestLayout.scss';
import { Dialog, DialogTitle } from '@material-ui/core';

const FreshestLayout = ({ title, className, children, canBack }) => {
    const userContext = useContext(UserContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const logoutModal = useMemo(() => {
        return <Dialog className={'logoutModal'} open={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
            <DialogTitle>Đăng xuất</DialogTitle>
            <form>
                <Button variant={'primary'} onClick={() => userContext.logout()}>
                    Đồng ý
                </Button>
                <Button variant={'outline-primary'} onClick={() => setShowLogoutModal(false)}>
                    Bỏ qua
                </Button>
            </form>
        </Dialog>;
    }, [userContext, showLogoutModal]);

    return <Container fluid className={classNames('mainLayout freshestLayout', className)}>
        <Row xs={12} className={'headerLayout'}>
            {canBack && <ArrowBack onClick={() => {
                window.history.back();
            }}/>}
            <Navbar expand='lg'>
                <Navbar.Brand>
                    {title}
                </Navbar.Brand>
                <Navbar.Collapse className={classNames({ 'show': userContext.token })}>
                    <PowerSettingsNew onClick={() => setShowLogoutModal(true)}/>
                </Navbar.Collapse>
            </Navbar>
        </Row>
        <Row className={'layoutBody'}>
            {children}
        </Row>
        {logoutModal}
    </Container>;
};

export default FreshestLayout;
