import { Card, CardContent, CardHeader, CircularProgress, makeStyles, Typography } from "@material-ui/core";
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useHistory } from "react-router";
import { updateEntry } from "./actions/entry";
import { setUnread } from "./actions/marker";
import AppBarButton from "./components/AppBarButton";
import { useDoubleTap } from "./hooks/callbacks";
import { useResult } from "./hooks/promise";
import { useIsPhone } from "./hooks/responsive";
import { useStore } from "./hooks/store";
import { EntryReadButton } from "./MarkerButton";
import { Entry } from "./model/entry";
import { loadEntry } from "./services/db";
import { getEntryByline, getEntryContent, getEntryUrl } from "./services/entry";
import { useEntry } from "./hooks/entry";

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

const useMaybeMarkAsRead = (entry: Entry) => {
    const store = useStore();
    const shouldMarkAsRead = store.settings.markOpenedAsRead;

    useEffect(() => {
        if (!entry || !entry.unread || !shouldMarkAsRead) return;

        setUnread(entry, false);
    }, [entry, shouldMarkAsRead]);
}

const useScrollToTop = (entry: Entry, ref: React.MutableRefObject<any>) => {
    useEffect(() => {
        if (!entry || !ref || !ref.current) return;

        ref.current.parentElement.scrollTo(0, 0);
    }, [entry, ref]);
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
    
    const entry = useEntry(props.id);

    useEffect(() => {
        if (entry || !props.id) return;
        updateEntry(props.id);
    }, [props.id, entry]);

    useMaybeMarkAsRead(entry);
    useScrollToTop(entry, domElement);

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
            rel="noopener noreferrer"
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