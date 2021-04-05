import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.scss';

// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";
// Sentry.init({
//     dsn: "https://fdb28c5438844079b4405165666640c3@o503454.ingest.sentry.io/5588615",
//     autoSessionTracking: true,
//     integrations: [
//         new Integrations.BrowserTracing(),
//     ],
//     // We recommend adjusting this value in production, or using tracesSampler
//     // for finer control
//     tracesSampleRate: 1.0,
// });

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
