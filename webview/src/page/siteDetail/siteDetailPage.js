import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { navigate } from '@reach/router';
import { Container } from 'react-bootstrap';
import { buildStyles } from 'react-circular-progressbar';
import CandyLayout from '../../components/layout/candyLayout';
import queryParser from '../../service/queryParametersParser';
import CircularBar from '../../components/circularBar/circularBar';
import siteService from '../../service/siteService';
import SiteOverview from '../../components/siteOverview/siteOverview';

import './siteDetailPage.scss';

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
    const [siteOverView, setSiteOverView] = useState();
    const [page, setPage] = useState(pages[0].id);

    const siteId = useMemo(() => queryParser.parse(location.search)['id'], [location]);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!site) {
            navigate('/sites');
        }
    }, [site]);

    useEffect(() => {
        if (siteId) {
            const handle = (data) => setSiteOverView(data);
            siteService.registerId(siteId, handle);

            return () => {
                siteService.unRegister(siteId);
            };
        }
    }, [siteId]);

    const gaugeDom = useMemo(() => {
        return <CircularBar value={siteOverView ? siteOverView.current / siteOverView.max : 0} styles={buildStyles({
            pathColor: '#317ad4'
        })}>
            <div className={'innerBarWatt'}>
                {siteOverView && <p className={'description'}>Công xuất</p>}
                <p className={'currentPower'}>{siteOverView ? Math.floor(siteOverView.current * 10) / 10 : '- -'}</p>
                {siteOverView && <p className={'unitPower'}>Watt</p>}
            </div>
        </CircularBar>;
    }, [siteOverView]);

    const bodyDom = useMemo(() => {
        switch (page) {
            case 'overview':
                return <SiteOverview
                    data={siteOverView}
                />;
            default:
                break;
        }
    }, [page, siteOverView]);

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
