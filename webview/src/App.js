import React from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Router } from '@reach/router';
import AppPage from './page/appPage/appPage';

import './App.scss';

const App = () => {
    return <Router>
        <AppPage path='/'/>
    </Router>;
};

export default App;
