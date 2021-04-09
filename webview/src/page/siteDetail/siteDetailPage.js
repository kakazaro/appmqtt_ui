import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { navigate } from '@reach/router';
import { Container } from 'react-bootstrap';
import CandyLayout from '../../components/layout/candyLayout';
import queryParser from '../../service/queryParametersParser';
import SiteOverview from '../../components/siteOverview/siteOverview';

import './siteDetailPage.scss';
import SiteDevices from '../../components/siteDevices/siteDevices';

//https://codepen.io/qindazhu/pen/ZWNKoG

const pages = [
    {
        id: 'overview',
        label: 'Thông số',
        icon: <i className="fas fa-clipboard-list"/>
    },
    {
        id: 'devices',
        label: 'Thiết bị',
        icon: <i className="fas fa-server"/>
    },
    {
        id: 'issue',
        label: 'Sự cố',
        icon: <i className="fas fa-exclamation-triangle"/>
    },
];

const SiteDetailPage = ({ location }) => {
    const [site] = useState(location?.state?.site);
    const [page, setPage] = useState(pages[0].id);
    const [gaugeDom, setGaugeDom] = useState();

    const siteId = useMemo(() => queryParser.parse(location.search)['id'], [location]);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!site) {
            navigate('/sites');
        }
    }, [site]);

    const bodyDom = useMemo(() => {
        switch (page) {
            case 'overview':
                return <SiteOverview
                    siteId={siteId}
                    onGaugeChange={(dom) => setGaugeDom(dom)}
                />;
            case 'devices':
                return <SiteDevices
                    siteId={siteId}
                    onGaugeChange={(dom) => setGaugeDom(dom)}
                />
            default:
                break;
        }
    }, [page]);

    return <CandyLayout
        className={'siteDetailPage'}
        title={site?.name}
        status={site?.isFail ? 'bị sự cố' : 'bình thường'}
        isOkay={!site?.isFail}
        gauge={gaugeDom}
        pages={pages}
        page={page}
        onPageChange={(page) => setPage(page)}
    >
        <Container className="siteBody">
            <div className={'bodyContain'}>
                {bodyDom}
            </div>
        </Container>
    </CandyLayout>;
};

export default SiteDetailPage;
