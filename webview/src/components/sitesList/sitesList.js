import React, { useState, useEffect, useMemo, useContext } from 'react';
import FreshestLayout from '../layout/freshestLayout';
import { Row, Col } from 'react-bootstrap';
import { navigate } from '@reach/router';
import axios from '../../service/axios';
import SiteBadge from '../badge/siteBadge/siteBadge';
import FreshFilter from '../freshFilter/freshFilter';
import UserContext from '../userContext/userContext';

import './sitesList.scss';
import utility from '../../service/utility';

const ITEMS_FILTER = [
    {
        name: 'Tất cả',
        key: 'all'
    }
];

const SitesList = () => {
    const [sites, setSites] = useState();
    const [filterValue, setFilterValue] = useState(ITEMS_FILTER[0]);
    const userContext = useContext(UserContext);
    const token = useMemo(() => userContext?.token, [userContext]);

    // const token = useMemo(() => queryParser.parse(location.search)['token'], [location]);

    useEffect(() => {
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
        const filters = ITEMS_FILTER.concat(Object.keys(utility.STATUS).map(key => ({ name: utility.STATUS[key].label, key: utility.STATUS[key].id })));
        return <FreshFilter items={filters} value={filterValue} onChange={(item) => setFilterValue(item)}/>;
    }, [filterValue]);

    return <FreshestLayout className="sitesList" title={'NT.V Corp'}>
        <div className="sitesBody">
            <Col>
                <Row className={'filterRow'}>
                    {filterDom}
                </Row>
                <Row className={'sitesRow'}>
                    {sitesDom}
                </Row>
            </Col>
        </div>
    </FreshestLayout>;
};

export default SitesList;
