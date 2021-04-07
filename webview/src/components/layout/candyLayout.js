import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';

import './candyLayout.scss';

const CandyLayout = ({ title, className, gauge, children, status, isOkay }) => {
    return <div className={classNames('mainLayout candyLayout', className, { fail: !isOkay })}>
        <Container className={'status'}>
            <div>
                <p className={'header'}>{title}</p>
                <p className={'statusText'}>{`Trạng thái: ${status}`}</p>
                <div className={classNames('statusIndicate', { fail: !isOkay })}/>
            </div>
        </Container>
        <div className={'gauge'}>
            <div className={'bar'}>
                {gauge}
            </div>
        </div>
        <div className={'layoutBody'}>
            {children}
        </div>
    </div>;
};

export default CandyLayout;
