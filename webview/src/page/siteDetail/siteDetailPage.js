import React, { useState, useMemo, useEffect } from 'react';
import CandyLayout from '../../components/layout/candyLayout';
import { Col, Container, Row } from 'react-bootstrap';

import './siteDetailPage.scss';
import queryParser from '../../service/queryParametersParser';

const SiteDetailPage = ({ location }) => {
    const [site, setSite] = useState(location?.state?.site);
    const siteId = useMemo(() => queryParser.parse(location.search)['id'], [location]);

    useEffect(() => {
        console.log(site);
    }, [site]);

    return <CandyLayout
        className={'siteDetailPage'}
        title={site?.name}
        status={site?.isFail ? 'sự cố' : 'bình thường'}
        isOkay={!site?.isFail}>
        <Container className='siteBody'>
            {Array(30).fill('a').map((value, index) => <p key={index}>{value}</p>)}
        </Container>
    </CandyLayout>;
};

export default SiteDetailPage;
