import React, { useState, useEffect, useMemo } from 'react';
import FreshestLayout from '../../components/layout/freshestLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { navigate } from '@reach/router';
import axios from '../../service/axios';
import queryParser from '../../service/queryParametersParser';
import SiteBadge from '../../components/siteBadge/siteBadge';
import FreshFilter from '../../components/freshFilter/freshFilter';

import './sitesPage.scss';

const ITEMS_FILTER = [
    {
        name: 'Tất cả trạm điện',
        key: 'all'
    },
    {
        name: 'Các trạm điện bị sự cố',
        key: 'fail'
    },
    {
        name: 'Các trạm điện trạng thái tốt',
        key: 'good'
    },
];

const SitesPage = ({ location }) => {
    const [sites, setSites] = useState();
    const [filterValue, setFilterValue] = useState(ITEMS_FILTER[0]);

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
            return sites.map((site, index) => <SiteBadge key={index} site={site} onClick={() => {
                navigate('/site?id=' + encodeURIComponent(site.id), { state: { site } }).then();
            }}/>);
        }
    }, [sites]);

    const filterDom = useMemo(() => {
        return <FreshFilter items={ITEMS_FILTER} value={filterValue} onChange={(item) => setFilterValue(item)}/>;
    }, [filterValue]);

    return <FreshestLayout className='sitesPage' title={'Trạm điện'}>
        <Container className='sitesBody'>
            <Col>
                <Row>
                    {filterDom}
                </Row>
                <Row>
                    {sitesDom}
                </Row>
            </Col>
        </Container>
    </FreshestLayout>;
};

export default SitesPage;
