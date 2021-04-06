import React, { useState, useEffect, useMemo } from 'react';
import FreshestLayout from '../../components/layout/freshestLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { navigate } from '@reach/router';
import axios from '../../service/axios';
import queryParser from '../../service/queryParametersParser';
import SiteBadge from '../../components/siteBadge/siteBadge';

import './sitesPage.scss';

const SitesPage = ({ location }) => {
    const [sites, setSites] = useState();

    const token = useMemo(() => queryParser.parse(location.search)['token'], [location]);

    useEffect(() => {
        console.log(token);
        if (token) {
            (async () => {
                try {
                    const response = await axios.get('/sites', {
                        headers: {
                            token
                        }
                    });
                    setSites(response.data.sites);
                } catch (err) {
                    console.error(err);
                }
            })();
        }
    }, [token]);

    const sitesDom = useMemo(() => {
        if (sites) {
            return sites.map((site, index) => <SiteBadge key={index} site={site}/>);
        }
    }, [sites]);

    return <FreshestLayout className='sitesPage' title={'Trạm điện'}>
        <Container className='sitesBody'>
            <Col>
                <Row>
                    {sitesDom}
                </Row>
            </Col>
        </Container>
    </FreshestLayout>;
};

export default SitesPage;
