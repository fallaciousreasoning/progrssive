import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation, useRouteMatch } from 'react-router-dom';
import StreamViewer from './StreamViewer';
import EntryViewer from './EntryViewer';
import { useIsPhone } from '../hooks/responsive';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    stream: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '400px'
        }
    },
    entry: {
        maxHeight: 'calc(100vh - 48px)',
        width: '100%',
        overflowY: 'auto',
        flex: 1
    },
    '@global': {
        'body': {
            background: theme.palette.background.default
        }
    }
}));

export default () => {
    const styles = useStyles();
    const location = useLocation();
    const isPhone = useIsPhone();

    // Path should be something like this:
    // /stream/:streamId?(/entries/entryId)?
    const path = location.pathname
        // Trim leading and trailing slash
        .substring(1, location.pathname.endsWith('/')
            ? location.pathname.length - 1
            : location.pathname.length)
        .split('/');

    if (path[0] !== 'stream' || path.length > 4)
        return null;

    let streamId = '';
    let entryId = '';

    // Case: /stream/:streamId/entries/:entryId
    if (path.length === 4) {
        streamId = path[1];
        if (path[2] !== 'entries')
            return null;

        entryId = path[3];
    }

    // Case: /stream/entries/:entryId
    if (path.length === 3) {
        if (path[1] !== 'entries')
            return null;
        entryId = path[2];
    }

    // Case: /stream/:streamId
    if (path.length === 2) {
        streamId = path[1];
    }

    streamId = decodeURIComponent(streamId || '');
    entryId = decodeURIComponent(entryId || '');

    const streamActive = !entryId || !isPhone;
    const entryActive = !!entryId;

    return <div className={styles.root}>
        {(!entryId || !isPhone) && <div className={styles.stream}>
            <StreamViewer location={window.location} id={streamId} active={streamActive} />
        </div>}
        {entryActive && <div className={styles.entry}>
            <EntryViewer id={entryId} active={entryActive} />
        </div>}
    </div>
}