import { Card, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Share } from "@material-ui/icons";
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from "react-router";
import AppBarButton from "../components/AppBarButton";
import { useDoubleTap } from "../hooks/callbacks";
import { useEntry } from "../hooks/entry";
import { useIsPhone } from "../hooks/responsive";
import { useStore } from "../hooks/store";
import { EntryReadButton } from "../MarkerButton";
import { Entry, EntryContent } from "../model/entry";
import { getEntryByline, getEntryContent, getEntryUrl } from "../services/entry";
import { useResult } from "../hooks/promise";
import mobilize from "../services/mobilize";
import { useOnMount } from "../hooks/lifeCycle";
import { loadMobilizedContent } from "../actions/entry";

const useStyles = makeStyles({
    root: {
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    '@global': {
        'article img': {
            width: '100%',
            height: 'auto'
        },
        'article figure': {
            margin: 0
        },
        'article iframe': {
            maxWidth: '100%',
            height: 'auto'
        }
    },
    titleLink: {
        textDecoration: 'none'
    },
    shareButton: {
        color: 'white !important'
    }
});

const useScrollToTop = (entry: Entry, ref: React.MutableRefObject<any>) => {
    useEffect(() => {
        if (!entry || !ref || !ref.current) return;

        ref.current.parentElement.scrollTo(0, 0);
    }, [entry, ref]);
}

export default (props: { id: string }) => {
    const store = useStore();
    const history = useHistory();

    const styles = useStyles();
    const isPhone = useIsPhone();
    const domElement = useRef(null);
    const entry = useEntry(props.id);

    useScrollToTop(entry, domElement);
    useOnMount(() => {
        loadMobilizedContent(props.id);
    });

    const doubleTap = useDoubleTap((event) => {
        if (!store.settings.doubleTapToCloseArticles)
            return;

        history.goBack();
        event.stopPropagation();
        // Clear potential accidental selection.
        document.getSelection().removeAllRanges();
    }, []);

    const shareArticle = useCallback(() => {
        navigator.share({
            title: entry.title,
            url: getEntryUrl(entry)
        });
    }, [entry]);

    const url = getEntryUrl(entry);

    if (!entry)
        return <CircularProgress />;

    const content = entry.mobilized
        ? entry.mobilized.content
        : getEntryContent(entry);

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
        <AppBarButton>
            <EntryReadButton entryId={entry.id} />
        </AppBarButton>
        {navigator.share && <AppBarButton>
            <IconButton
                className={styles.shareButton}
                onClick={shareArticle}>
                <Share />
            </IconButton>
        </AppBarButton>}
    </article>;
};