import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Errorboundry from './Hoc/ErrorBoundry/ErrorBoundry';
import 'semantic-ui-css/semantic.min.css';

const app = (
    <Errorboundry>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Errorboundry>
)

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
