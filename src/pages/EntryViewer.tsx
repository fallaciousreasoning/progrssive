import { Button, Card, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Share } from "@material-ui/icons";
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from "react-router";
import { loadMobilizedContent } from "../actions/entry";
import AppBarButton from "../components/AppBarButton";
import Centre from "../components/Centre";
import PreferredViewMenu from "../components/PreferredViewMenu";
import StackPanel from "../components/StackPanel";
import { useDoubleTap } from "../hooks/callbacks";
import { useEntry } from "../hooks/entry";
import { useIsPhone } from "../hooks/responsive";
import { useStore } from "../hooks/store";
import useWhenChanged from "../hooks/useWhenChanged";
import { EntryReadButton } from "../MarkerButton";
import { Entry } from "../model/entry";
import { useIsActive } from "../Routes";
import { getEntryByline, getEntryContent, getEntryPreferredView, getEntrySubscription, getEntryUrl } from "../services/entry";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    '@global': {
        'article': {
            color: theme.palette.text.primary
        },
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
        },
        'article a': {
            color: theme.palette.info.main
        }
    },
    titleLink: {
        textDecoration: 'none'
    },
    shareButton: {
    }
}));

const useScrollToTop = (entry: Entry, ref: React.MutableRefObject<any>) => {
    useEffect(() => {
        if (!entry || !ref || !ref.current) return;

        ref.current.parentElement.scrollTo(0, 0);
    }, [entry, ref]);
}

export default (props: { id: string, location: Location }) => {
    const store = useStore();
    const history = useHistory();
    const isActive = useIsActive(props.location.pathname);
    const styles = useStyles();
    const isPhone = useIsPhone();
    const domElement = useRef(null);
    const entry = useEntry(props.id);
    const url = getEntryUrl(entry);
    const [currentView, setCurrentView] = useState(getEntryPreferredView(entry));
    const [failedToMobilize, setFailedToMobilize] = useState(false);

    useScrollToTop(entry, domElement);

    const preferredViewChanged = useCallback(view => {
        if (view === "browser") {
            window.open(url, "_blank");
            return;
        }

        setCurrentView(view);
    }, [url]);

    const subscription = getEntrySubscription(entry);
    useWhenChanged(() => {
        // We haven't tried to mobilize yet.
        setFailedToMobilize(false);

        // Mozilla mobilization is asynchronous.
        if (currentView === "mozilla") {
            loadMobilizedContent(props.id)
                .catch(() => {
                    setFailedToMobilize(true);
                    window.snackHelper.enqueueSnackbar("Failed to mobilize article! Are you offline?");
                });
        }
    }, [currentView]);

    // When the preferred view for the subscription changes,
    // reset the current view.
    useWhenChanged(() => {
        // Transient entries have no subscription.
        if (!subscription) {
            setCurrentView("feedly");
            return;
        }

        // Can't show the browser view, so display feedly instead.
        if (subscription.preferredView === "browser") {
            setCurrentView("feedly");
            return;
        }

        setCurrentView(subscription.preferredView);
    }, [subscription && subscription.preferredView]);

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


    if (!entry) {
        return <Centre>
            <CircularProgress />
        </Centre>;
    }

    const content = currentView === "mozilla"
        ? entry.mobilized && entry.mobilized.content
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
        <CardContent>
            {content
                ? <Typography component='small'>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </Typography>
                : <StackPanel center>
                    <Typography component="small">
                        {failedToMobilize
                            ? "Failed to mobilize article."
                            : "Mobilizing..."}
                    </Typography>
                    {failedToMobilize
                        ? <StackPanel direction="row">
                            <Button
                                variant="outlined"
                                onClick={() => setCurrentView("mozilla")}>View Feedly</Button>
                            <Button
                                variant="outlined"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer">
                                Open in Browser
                            </Button>
                        </StackPanel>
                        : <CircularProgress />}

                </StackPanel>}
        </CardContent>
    </>;

    return <article className={styles.root} ref={domElement} onClick={doubleTap}>
        {isPhone
            ? article
            : <Card>{article}</Card>}
        {isActive && <>
            {!entry.transient && <AppBarButton>
                <EntryReadButton entryId={entry.id} />
            </AppBarButton>}
            {navigator.share && <AppBarButton>
                <IconButton
                    className={styles.shareButton}
                    onClick={shareArticle}>
                    <Share />
                </IconButton>
            </AppBarButton>}
            <AppBarButton>
                <PreferredViewMenu
                    value={currentView}
                    onChange={preferredViewChanged} />
            </AppBarButton>
        </>}
    </article>;
};