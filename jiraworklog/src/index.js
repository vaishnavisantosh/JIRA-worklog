import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import Errorboundry from './Hoc/ErrorBoundry/ErrorBoundry';

const app = (
    <Errorboundry>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Errorboundry>
)

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
