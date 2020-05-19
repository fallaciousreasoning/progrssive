import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initStore } from './services/store';
import * as serviceWorker from './serviceWorker';
import { updateSubscriptions } from './services/subscriptions';

// Make sure our store is initialized.
initStore();

// Fetch subscriptions.
updateSubscriptions();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
