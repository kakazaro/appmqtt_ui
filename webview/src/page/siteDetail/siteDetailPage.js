import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { navigate } from '@reach/router';
import { Container } from 'react-bootstrap';
import CandyLayout from '../../components/layout/candyLayout';
import queryParser from '../../service/queryParametersParser';
import SiteOverview from '../../components/siteOverview/siteOverview';
import SiteDevices from '../../components/siteDevices/siteDevices';
import SiteHistory from '../../components/siteHistory/siteHistory';

import './siteDetailPage.scss';

//https://codepen.io/qindazhu/pen/ZWNKoG

const pages = [
    {
        id: 'overview',
        label: 'Thông số',
        icon: <i className="fas fa-clipboard-list"/>,
        page: SiteOverview
    },
    {
        id: 'devices',
        label: 'Thiết bị',
        icon: <i className="fas fa-server"/>,
        page: SiteDevices
    },
    {
        id: 'history',
        label: 'Lịch sử',
        icon: <i className="fas fa-exclamation-triangle"/>,
        page: SiteHistory
    },
];

const SiteDetailPage = ({ location, page }) => {
    const [site] = useState(location?.state?.site);
    const [gaugeDom, setGaugeDom] = useState();
    const selectedPage = useMemo(() => page || pages[0].id, [page]);

    const siteId = useMemo(() => queryParser.parse(location.search)['id'], [location]);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!site) {
            navigate('/');
        }
    }, [site]);

    const bodyDom = useMemo(() => {
        const PageFunc = selectedPage && pages.find(p => p.id === selectedPage)?.page;
        if (selectedPage) {
            return <PageFunc siteId={siteId} onGaugeChange={(dom) => setGaugeDom(dom)}/>;
        }
    }, [selectedPage, siteId]);

    return <CandyLayout
        className={'siteDetailPage'}
        title={site?.name}
        status={site?.isFail ? 'bị sự cố' : 'bình thường'}
        isOkay={!site?.isFail}
        gauge={gaugeDom}
        pages={pages}
        page={selectedPage}
        onPageChange={(page) => navigate('/site/' + page + '?id=' + encodeURIComponent(site.id), { state: { site } }).then()}
    >
        <Container className="siteBody">
            <div className={'bodyContain'}>
                {bodyDom}
            </div>
        </Container>
    </CandyLayout>;
};

export default SiteDetailPage;
