import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { navigate } from '@reach/router';
import { Container, Nav } from 'react-bootstrap';
import { buildStyles } from 'react-circular-progressbar';
import CandyLayout from '../../components/layout/candyLayout';
import queryParser from '../../service/queryParametersParser';
import CircularBar from '../../components/circularBar/circularBar';
import siteService from '../../service/siteService';

import './siteDetailPage.scss';

//https://codepen.io/qindazhu/pen/ZWNKoG

const SiteDetailPage = ({ location }) => {
    const [site] = useState(location?.state?.site);
    const [siteOverView, setSiteOverView] = useState();
    const [page, setPage] = useState('overview');

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

    useEffect(() => {
        console.log(siteOverView);
    }, [siteOverView]);

    const gaugeDom = useMemo(() => {
        return <CircularBar value={siteOverView ? siteOverView.current / siteOverView.max : 0} styles={buildStyles({
            pathColor: '#317ad4'
        })}>
            <div className={'innerBarWatt'}>
                <p className={'currentPower'}>{siteOverView ? Math.floor(siteOverView.current * 10) / 10 : '- -'}</p>
                {siteOverView && <p className={'unitPower'}>Watt</p>}
            </div>
        </CircularBar>;
    }, [siteOverView]);

    return <CandyLayout
        className={'siteDetailPage'}
        title={site?.name}
        status={site?.isFail ? 'bị sự cố' : 'bình thường'}
        isOkay={!site?.isFail}
        gauge={gaugeDom}>
        <Container className="siteBody">
            <div className={'navContain'}>
                <Nav activeKey={page} onSelect={(key) => setPage(key)}>
                    <Nav.Item>
                        <Nav.Link eventKey="overview">Tổng quan</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="devices">Thiết bị</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="charts">Biểu đồ</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </Container>
    </CandyLayout>;
};

export default SiteDetailPage;
