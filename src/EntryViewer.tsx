import { makeStyles, Card, CardContent, CardHeader, CircularProgress, Typography, Fab } from "@material-ui/core";
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useIsPhone } from "./hooks/responsive";
import { useEntry } from "./hooks/stream";
import { getEntryByline, getEntryContent, getEntryUrl } from "./services/entry";
import { getStore, useStore } from "./hooks/store";
import { updateEntry } from "./actions/entry";
import AppBarButton from "./components/AppBarButton";
import { EntryReadButton } from "./MarkerButton";
import { Entry } from "./model/entry";
import { setUnread } from "./actions/marker";
import { useDoubleTap } from "./hooks/callbacks";
import { useHistory } from "react-router";

const useStyles = makeStyles({
    root: {
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    '@global': {
        'article img': {
            width: '100%'
        },
        'article figure': {
            margin: 0
        }
    },
    titleLink: {
        textDecoration: 'none'
    }
});

const maybeMarkAsRead = (entry: Entry) => {
    const store = useStore();
    const shouldMarkAsRead = store.settings.markOpenedAsRead;

    useEffect(() => {
        if (!entry || !entry.unread || !shouldMarkAsRead) return;

        setUnread(entry, false);
    }, [entry && entry.id, shouldMarkAsRead]);
}

const scrollToTop = (entry: Entry, ref: React.MutableRefObject<any>) => {
    useEffect(() => {
        if (!entry || !ref || !ref.current) return;

        ref.current.parentElement.scrollTo(0, 0);
    }, [entry && entry.id]);
}

interface Props {
    id: string,
    active: boolean
}

export default (props: Props) => {
    const store = useStore();
    const history = useHistory();

    const styles = useStyles();
    const isPhone = useIsPhone();
    const domElement = useRef(null);

    const entry = store.entries[props.id];

    useEffect(() => {
        if (entry || !props.id) return;
        updateEntry(props.id);
    }, [props.id]);

    maybeMarkAsRead(entry);
    scrollToTop(entry, domElement);

    const doubleTap = useDoubleTap((event) => {
        if (!store.settings.doubleTapToCloseArticles)
            return;

        history.goBack();
        event.stopPropagation();
        // Clear potential accidental selection.
        document.getSelection().removeAllRanges();
    }, []);

    if (!entry)
        return <CircularProgress />;

    const content = getEntryContent(entry);
    const url = getEntryUrl(entry);

    const title = url
        ? <a
            target="_blank"
            href={url}
            className={styles.titleLink}>
            {entry.title}
        </a>
        : entry.title;

    const article = <>
        <CardHeader
            title={title}
            subheader={getEntryByline(entry)} />
        {content && <CardContent>
            <Typography component='small'>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Typography>
        </CardContent>}
    </>;

    return <article className={styles.root} ref={domElement} onClick={doubleTap}>
        {isPhone
            ? article
            : <Card>{article}</Card>}
        {props.active && <>
            <AppBarButton>
                <EntryReadButton entry={entry} />
            </AppBarButton>
        </>}
    </article>;
};