import { Card, CardContent, CardHeader, CircularProgress, Typography, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useIsPhone } from "./hooks/responsive";
import { useEntry } from "./hooks/stream";
import { getEntryByline, getEntryContent } from "./services/entry";
import { getStore, useStore } from "./hooks/store";
import { updateEntry } from "./actions/entry";
import AppBarButton from "./components/AppBarButton";
import { EntryReadButton, EntrySavedButton } from "./MarkerButton";
import { Add } from "@material-ui/icons";
import { Entry } from "./model/entry";
import { setUnread } from "./actions/marker";
import { useDoubleTap } from "./hooks/callbacks";
import { withRouter, RouteComponentProps } from "react-router";

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

interface Props extends RouteComponentProps<{}> {
    id: string,
    active: boolean
}

export default withRouter((props: Props) => {
    const store = useStore();

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

        props.history.goBack();
        event.stopPropagation();
        // Clear potential accidental selection.
        document.getSelection().removeAllRanges();
    }, []);

    if (!entry)
        return <CircularProgress />;

    const content = getEntryContent(entry);

    const article = <>
        <CardHeader
            title={entry.title}
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
            <AppBarButton>
                <EntrySavedButton entry={entry} />
            </AppBarButton>
        </>}
    </article>;
});