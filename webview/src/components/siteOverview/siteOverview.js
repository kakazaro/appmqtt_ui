import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Container, Col, Row } from 'react-bootstrap';
import utility from '../../service/utility';
import SiteChart from '../siteChart/siteChart';
import siteService from '../../service/siteService';
import { navigate } from '@reach/router';
import { Skeleton } from '@material-ui/lab';

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
                            {info.main.value === undefined ?
                                <Skeleton width={(Math.random() * 20 + 20) + '%'} height={30} style={{ marginRight: 0, marginLeft: 'auto' }}/>
                                : <>
                                    <span>{info.main.value}</span>
                                    <span className={'valueUnit'}>{info.main.unit}</span>
                                </>}
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
                            {info.sub.value === undefined ?
                                <Skeleton width={(Math.random() * 30 + 40) + '%'} height={20} style={{ marginRight: 0, marginLeft: 'auto' }}/>
                                : <>
                                    <span>{info.sub.value}</span>
                                    <span>{info.sub.unit}</span>
                                </>}
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
            const registerId = siteService.registerSiteData(site.id, 'overview', handle, undefined, 10000);

            return () => {
                siteService.unRegisterSiteData(registerId);
            };
        } else {
            navigate('/').then();
        }
    }, [site]);

    const cardDom = useMemo(() => {
        return <Col>
            <SiteCard info={{
                main: {
                    text: 'Công xuất hiện tại',
                    ...(siteOverviewData ? utility.makeupPower(siteOverviewData.curSumActPower) : undefined)
                },
                sub: {
                    text: 'Công xuất danh định',
                    ...(siteOverviewData ? utility.makeupPower(siteOverviewData.ratedSumPower, 'p') : undefined)
                }
            }}/>
            <SiteCard info={{
                main: {
                    text: 'Tổng Sản lượng điện trong ngày',
                    ...(siteOverviewData ? utility.makeupProduct(siteOverviewData.todaySumEnergy) : undefined)
                },
                sub: {
                    text: 'Tổng Sản lượng tích lũy',
                    ...(siteOverviewData ? utility.makeupProduct(siteOverviewData.allSumEnergy) : undefined)
                }
            }}/>
            <SiteCard info={{
                main: {
                    text: 'Lợi nhuận trong ngày',
                    ...(siteOverviewData ? utility.makeupMoney(siteOverviewData.todaySumEnergy * 1720) : undefined)
                },
                sub: {
                    text: 'Tổng doanh thu',
                    ...(siteOverviewData ? utility.makeupMoney(siteOverviewData.allSumEnergy * 1720) : undefined)
                }
            }}/>
        </Col>;
    }, [siteOverviewData]);

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
