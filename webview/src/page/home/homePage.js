import React, { useMemo } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Home, HomeOutlined, ErrorOutline, Error, SupervisedUserCircleOutlined, SupervisedUserCircle } from '@material-ui/icons';
import { navigate } from '@reach/router';
import SitesList from '../../components/sitesList/sitesList';
import GlobalEvent from '../../components/globalEvents/globalEvent';

import './homePage.scss';

const pages = [
    {
        id: 'sites',
        label: 'Trang chủ',
        icon: <HomeOutlined/>,
        selectedIcon: <Home/>,
        page: SitesList
    },
    {
        id: 'events',
        label: 'Sự cố',
        icon: <ErrorOutline/>,
        selectedIcon: <Error/>,
        page: GlobalEvent
    },
    {
        id: 'manage',
        label: 'Quản lý',
        icon: <SupervisedUserCircleOutlined/>,
        selectedIcon: <SupervisedUserCircle/>
    },
];

const HomePage = ({ page }) => {
    const selectedPage = useMemo(() => page || pages[0].id, [page]);

    const bodyDom = useMemo(() => {
        const PageFunc = selectedPage && pages.find(p => p.id === selectedPage)?.page;
        if (PageFunc) {
            return <PageFunc/>;
        }

        return null;
    }, [selectedPage]);

    return <div className={'homePage'}>
        <div className={'homeBody'}>
            {bodyDom}
        </div>

        <BottomNavigation
            value={selectedPage}
            onChange={(event, newValue) => {
                navigate('/home/' + newValue);
            }}
            showLabels
            className={'homeNav'}
        >
            {pages.map((page) => <BottomNavigationAction value={page.id} key={page.id} label={page.label} icon={selectedPage === page.id ? page.selectedIcon : page.icon}/>)}
        </BottomNavigation>
    </div>;
};

export default HomePage;
