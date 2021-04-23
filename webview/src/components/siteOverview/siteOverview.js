import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Container, Col, Row } from 'react-bootstrap';
import utility from '../../service/utility';
import SiteChart from '../siteChart/siteChart';
import siteService from '../../service/siteService';
import { navigate } from '@reach/router';

import './siteOverview.scss';

const SiteCard = ({ info }) => {
    return <Row>
        <Col className={'siteCard'}>
            <Row className={'mainRow'}>
                <Container>
                    <Col>
                        <Row className={'textRow'}>
                            {info.main.text}
                        </Row>
                        <Row className={'valueRow'}>
                            <span>{info.main.value}</span>
                            <span className={'valueUnit'}>{info.main.unit}</span>
                        </Row>
                    </Col>
                </Container>
            </Row>
            <Row className={'subRow'}>
                <Container>
                    <Row>
                        <Col className={'textRow'} xs={7}>
                            {info.sub.text}
                        </Col>
                        <Col className={'valueRow'} xs={5}>
                            <span>{info.sub.value}</span>
                            <span>{info.sub.unit}</span>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Col>
    </Row>;
};

const SiteOverview = ({ site }) => {
    const [siteOverviewData, setSiteOverviewData] = useState();

    const siteStatus = useMemo(() => {
        const statusId = site?.status;
        const key = Object.keys(utility.STATUS).find(key => utility.STATUS[key].id === statusId);
        const status = key ? utility.STATUS[key] : undefined;

        return <Container>
            <Row>
                <Col>
                    Trạng thái trạm điện
                </Col>
                <Col className={'statusText'}>
                    {status && <><span className={classNames('statusIndicate', (status.id.toLowerCase()))}/><span>{status.label}</span></>}
                </Col>
            </Row>
        </Container>;
    }, [site]);

    useEffect(() => {
        if (site) {
            const handle = (data) => setSiteOverviewData(data.site);
            const registerId = siteService.registerSiteData(site.id, 'overview', handle);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        } else {
            navigate('/').then();
        }
    }, [site]);

    const cardDom = useMemo(() => {
        if (siteOverviewData) {
            return <Col>
                <SiteCard info={{
                    main: {
                        text: 'Công xuất hiện tại',
                        ...utility.makeupPower(siteOverviewData.curSumActPower)
                    },
                    sub: {
                        text: 'Công xuất danh định',
                        ...utility.makeupPower(siteOverviewData.ratedSumPower, 'p')
                    }
                }}/>
                <SiteCard info={{
                    main: {
                        text: 'Tổng Sản lượng điện trong ngày',
                        ...utility.makeupProduct(siteOverviewData.todaySumEnergy)
                    },
                    sub: {
                        text: 'Tổng Sản lượng tích lũy',
                        ...utility.makeupProduct(siteOverviewData.allSumEnergy)
                    }
                }}/>
                <SiteCard info={{
                    main: {
                        text: 'Lợi nhuận trong ngày',
                        ...utility.makeupMoney(siteOverviewData.todaySumEnergy * 1720)
                    },
                    sub: {
                        text: 'Tổng doanh thu',
                        ...utility.makeupMoney(siteOverviewData.allSumEnergy * 1720)
                    }
                }}/>
            </Col>;
        }
    }, [siteOverviewData]);

    if (!siteOverviewData) {
        return null;
    }

    return <div className={'siteOverview'}>
        <Col>
            <Row className={'statusRow'}>
                {siteStatus}
            </Row>
            <Row className={'product'}>
                {cardDom}
            </Row>
            <Row>
                <SiteChart siteId={site?.id}/>
            </Row>
        </Col>
    </div>;
};

export default SiteOverview;
