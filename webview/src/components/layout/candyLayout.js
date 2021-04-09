import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import './candyLayout.scss';

const CandyLayout = ({ title, className, gauge, children, status, isOkay, page, pages, onPageChange }) => {
    return <div className={classNames('mainLayout candyLayout', className, { fail: !isOkay })}>
        <Container className={'headerLayout'}>
            <ArrowBackIcon onClick={() => {
                window.history.back();
            }}/>
            <div className={classNames('statusIndicate', { fail: !isOkay })}>
                {!isOkay && <i className="fas fa-exclamation-triangle"/>}
                {isOkay && <i className="fas fa-circle"/>}
            </div>
        </Container>
        <Container className={'statusLayout'}>
            <div>
                <p className={'header'}>{title}</p>
                <p className={'statusText'}>{`Trạng thái: ${status}`}</p>
            </div>
        </Container>
        <div className={'gaugeLayout'}>
            <div className={'bar'}>
                {gauge}
            </div>
        </div>
        <div className={'layoutBody'}>
            {children}
        </div>
        <div className={'bottomNav'}>
            <BottomNavigation
                value={page}
                onChange={(event, newValue) => {
                    onPageChange(newValue);
                }}
                showLabels
            >
                {pages.map((page) => <BottomNavigationAction key={page.id} label={page.label} value={page.id} icon={page.icon}/>)}
            </BottomNavigation>
        </div>
    </div>;
};

export default CandyLayout;
