import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { navigate } from '@reach/router';

import './candyLayout.scss';

const CandyLayout = ({ title, className, children, selectedPage, pages, onPageChange }) => {
    return <div className={classNames('mainLayout candyLayout', className)}>
        <Container className={'headerLayout'}>
            <ArrowBackIcon onClick={() => navigate('/').then()}/>
        </Container>
        <Container className={'statusLayout'}>
            <div>
                <p className={'header'}>{title}</p>
            </div>
        </Container>
        <div className={'topNavBar'}>
            {pages.map(page => <div
                key={page.id}
                className={classNames('topNavAction', { isSelected: page.id === selectedPage })}
                onClick={() => onPageChange(page.id)}
            >
                <span>{page.label}</span>
            </div>)}
        </div>
        <div className={'layoutBody'}>
            {children}
        </div>
    </div>;
};

export default CandyLayout;
