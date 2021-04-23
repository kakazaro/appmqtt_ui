import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';
import SiteDetailPage from './page/siteDetail/siteDetailPage';
import ChartDetail from './page/chartDetail/chartDetail';
import sizeService from './service/sizeService';
import { UserProvider } from './components/userContext/userContext';
import HomePage from './page/home/homePage';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import 'moment/locale/vi';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

moment.locale('vi');

const App = () => {
    console.log(process.env.REACT_APP_BASE_URL_LOCAL)

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
        <UserProvider>
            <Router>
                <Redirect from="/" to="/home" noThrow/>
                <HomePage key={'home'} path="/home"/>
                <HomePage key={'home'} path="/home/:page"/>
                <SiteDetailPage key={'site'} path="/site"/>
                <SiteDetailPage key={'site'} path="/site/:page"/>
                <ChartDetail path="/chart"/>
            </Router>
        </UserProvider>
    </MuiPickersUtilsProvider>;
};

export default App;
