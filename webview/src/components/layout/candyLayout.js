import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';

import './candyLayout.scss';

const CandyLayout = ({ title, className, children, status, isOkay }) => {
    return <div className={classNames('mainLayout candyLayout', className, { fail: !isOkay })}>
        <Container className={'status'}>
            <div>
                <p>{title}</p>
                <p>{`Trạng thái: ${status}`}</p>
                <div className={'statusIndicate'}/>
            </div>
        </Container>
        <div className={'gauge'}>

        </div>
        <div className={'layoutBody'}>
            {children}
        </div>
    </div>;
};

export default CandyLayout;
