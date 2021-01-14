import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useLocation } from 'react-router-dom';
import SlidePage from '../components/SlidePage';
import { useIsPhone } from '../hooks/responsive';
import StreamViewer from './StreamViewer';
import Layout from './_Layout';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    stream: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '500px'
        }
    },
    entry: {
        maxHeight: 'calc(100vh - 48px)',
        width: '100%',
        overflowY: 'auto',
        flex: 1
    },
    page: {
        width: '100%',
        height: '100%'
    },
    '@global': {
        'body': {
            background: theme.palette.background.default
        }
    }
}));

const entryViewerPromise = import('./EntryViewer');
const EntryViewer = React.lazy(() => entryViewerPromise);

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

    const entryActive = !!entryId;
    const Container = isPhone ? SlidePage : 'div';
    return <div className={styles.root}>
        <Container>
            {(!entryActive || !isPhone) && <div key={"stream/" + streamId} className={styles.stream}>
                <Layout key="stream">
                    <StreamViewer id={streamId} />
                </Layout>
            </div>}
        </Container>

        <Container>
            {entryActive && <div key={entryId} className={styles.entry}>
                <Layout>
                    <EntryViewer id={entryId} />
                </Layout>
            </div>}
        </Container>
    </div>
}