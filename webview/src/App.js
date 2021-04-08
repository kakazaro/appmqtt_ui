import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import LoginPage from './page/login/loginPage';
import SitesPage from './page/sites/sitesPage';
import SiteDetailPage from './page/siteDetail/siteDetailPage';
import sizeService from './service/sizeService';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import 'moment/locale/vi';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

moment.locale('vi');

const App = () => {

    useEffect(() => {
        const handleResize = () => {
            sizeService.sizeChange(window.innerWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} locale={'vi'}>
        <Router>
            <LoginPage path="/"/>
            <SitesPage path="/sites"/>
            <SiteDetailPage path="/site"/>
        </Router>
    </MuiPickersUtilsProvider>;
};

export default App;
