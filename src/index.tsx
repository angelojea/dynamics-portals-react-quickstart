import ReactDOM from 'react-dom';
import { initializeIcons } from '@fluentui/react';

import { App } from './app';

import './index.scss';
import '../node_modules/@fluentui/react/dist/css/fabric.min.css';
import '../node_modules/animate.css/animate.min.css';
import '../node_modules/react-toastify/dist/ReactToastify.css';

initializeIcons();

ReactDOM.render(<App />, document.getElementById('aoj-app-container'));
