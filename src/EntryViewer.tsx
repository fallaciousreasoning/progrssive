import { Card, CardContent, CardHeader, CircularProgress, Typography, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from 'react';
import {useEffect, useRef} from 'react';
import { useIsPhone } from "./hooks/responsive";
import { useEntry } from "./hooks/stream";
import { getEntryByline, getEntryContent } from "./services/entry";
import { getStore, useStore } from "./hooks/store";
import { updateEntry } from "./actions/entry";
import AppBarButton from "./components/AppBarButton";
import { EntryReadButton, EntrySavedButton, setUnread } from "./MarkerButton";
import { Add } from "@material-ui/icons";
import { Entry } from "./model/entry";

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

const markRead = (entry: Entry) => {
    useEffect(() => {
        if (!entry || !entry.unread) return;

        setUnread(entry, false);
    }, [entry && entry.id]);
}

const scrollToTop = (entry: Entry, ref: React.MutableRefObject<any>) => {
    useEffect(() => {
        if (!entry || !ref || !ref.current) return;

        ref.current.parentElement.scrollTo(0, 0);
    }, [entry && entry.id]);
}

export default (props: { entryId: string }) => {
    const store = useStore();

    const styles = useStyles();
    const isPhone = useIsPhone();
    const domElement = useRef(null);

    const entry = store.entries[props.entryId];

    useEffect(() => {
        if (entry || !props.entryId) return;
        updateEntry(props.entryId);
    }, [props.entryId]);

    markRead(entry);
    scrollToTop(entry, domElement);

    if (!entry) 
        return <CircularProgress/>;

    const content = getEntryContent(entry);

    const article = <>
        <CardHeader
            title={entry.title}
            subheader={getEntryByline(entry)} />
        {content && <CardContent>
            <Typography component="small">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Typography>
        </CardContent>}
    </>;

    return <article className={styles.root} ref={domElement}>
        {isPhone
            ? article
            : <Card>{article}</Card>}
        <AppBarButton>
            <EntryReadButton entry={entry}/>
        </AppBarButton>
        <AppBarButton>
            <EntrySavedButton entry={entry}/>
        </AppBarButton>
    </article>;
}