import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import StreamViewer from './StreamViewer';
import EntryViewer from './EntryViewer';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    stream: {
        maxWidth: '800px'
    },
    entry: {
        maxHeight: 'calc(100vh - 48px)',
        width: '100%',
        overflowY: 'auto'
    },
    '@global': {
        'body': {
            background: theme.palette.background.default
        }
    }
}));

export default () => {
    const streamId = '';
    const unreadOnly = false;
    const entryId = 'PSNTZO8gXFUe+cpCZyApw0vEKWPT4b14D6teBEocIAE=_17334afa011:e01657:35147dfd';
    const styles = useStyles();
    const location = useLocation();

    return <div className={styles.root}>
        <div className={styles.stream}>
            <StreamViewer location={window.location} id={streamId}/>
        </div>
        <div className={styles.entry}>
            <EntryViewer id={entryId} location={window.location}/>
        </div>
    </div>
}