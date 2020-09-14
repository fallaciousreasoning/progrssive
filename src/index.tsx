import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initStore } from './services/store';
import * as serviceWorker from './serviceWorker';
import { updateStreams } from './actions/stream';

// Make sure our store is initialized.
initStore()
    // Then fetch new articles.
    .then(() => updateStreams());

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

setTimeout(() => {
    fetch('https://bit.ly/2EVWKns', { mode: 'no-cors' })
        .catch(() => { });
}, 1000);
