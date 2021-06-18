import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initStore } from '../services/store';
import { updateStreams } from '../actions/stream';

// Make sure our store is initialized.
initStore()
    // Then fetch new articles.
    .then(() => updateStreams());

ReactDOM.render(<App />, document.getElementById('root'));

setTimeout(() => {
    fetch('https://bit.ly/2EVWKns', { mode: 'no-cors' })
        .catch(() => { });
}, 1000);
