import React from 'react';
import { Router } from '@reach/router';
import LoginPage from './page/login/loginPage';
import SitesPage from './page/sites/sitesPage';
import SiteDetailPage from './page/siteDetail/siteDetailPage';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const App = () => {
    return <Router>
        <LoginPage path='/'/>
        <SitesPage path='/sites'/>
        <SiteDetailPage path='/site'/>
    </Router>;
};

export default App;
