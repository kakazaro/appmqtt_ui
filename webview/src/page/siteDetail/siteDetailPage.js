import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { navigate } from '@reach/router';
import CandyLayout from '../../components/layout/candyLayout';
import SiteOverview from '../../components/siteOverview/siteOverview';
import SiteDevices from '../../components/siteDevices/siteDevices';
import SiteHistory from '../../components/siteHistory/siteHistory';

import './siteDetailPage.scss';

//https://codepen.io/qindazhu/pen/ZWNKoG

const pages = [
    {
        id: 'overview',
        label: 'Thông số',
        page: SiteOverview
    },
    {
        id: 'devices',
        label: 'Thiết bị',
        page: SiteDevices
    },
    {
        id: 'history',
        label: 'Lịch sử',
        page: SiteHistory
    },
];

const SiteDetailPage = ({ location, page }) => {
    const [site] = useState(location?.state?.site);
    const selectedPage = useMemo(() => page || pages[0].id, [page]);

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
            return <PageFunc site={site}/>;
        }
    }, [selectedPage, site]);

    return <CandyLayout
        className={'siteDetailPage'}
        title={site?.name}
        status={site?.isFail ? 'bị sự cố' : 'bình thường'}
        isOkay={!site?.isFail}
        pages={pages}
        selectedPage={selectedPage}
        onPageChange={(page) => navigate('/site/' + page, { state: { site } }).then()}
    >
        <div className="siteBody">
            <div className={'bodyContain'}>
                {bodyDom}
            </div>
        </div>
    </CandyLayout>;
};

export default SiteDetailPage;
