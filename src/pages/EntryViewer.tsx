import { Button, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Share } from "@material-ui/icons";
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { collect, Store } from "react-recollect";
import { useHistory, useLocation } from "react-router";
import { loadMobilizedContent } from "../../actions/entry";
import AppBarButton from "../../components/AppBarButton";
import Centre from "../../components/Centre";
import PreferredViewMenu from "../../components/PreferredViewMenu";
import StackPanel from "../../components/StackPanel";
import { useDoubleTap } from "../../hooks/callbacks";
import { useEntry } from "../../hooks/entry";
import { useScreenSize } from "../../hooks/screenSize";
import useWhenChanged from "../../hooks/useWhenChanged";
import { EntryReadButton } from "../../components/MarkerButton";
import { getEntryByline, getEntryContent, getEntryPreferredView, getEntrySubscription, getEntryUrl } from "../../services/entry";
import {useSettings} from '../../services/settings';

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
            width: `calc(100% - ${theme.spacing(1)}px)`,
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

const EntryViewer = (props: { id: string, store: Store }) => {
    const history = useHistory();
    const styles = useStyles();
    const domElement = useRef<HTMLDivElement>(null);
    const entry = useEntry(props.id, props.store);
    const url = getEntryUrl(entry);
    const location = useLocation();
    const active = location.pathname.includes("/entries/");
    const [currentView, setCurrentView] = useState(getEntryPreferredView(entry));
    const [failedToMobilize, setFailedToMobilize] = useState(false);
    const { width: screenWidth } = useScreenSize();
    const settings = useSettings();

    useWhenChanged(() => {
        if (!domElement.current)
            return;

        // Find the first parent element that has been
        // scrolled.
        let element: HTMLElement = domElement.current;
        while (element && element.scrollHeight === element.clientHeight)
            element = element.parentElement;

        if (!element)
            return;

        element.scrollTo(0, 0);
    }, [props.id]);

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
    }, [currentView, props.id, !!entry]);

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
        if (!settings.doubleTapToCloseArticles)
            return;

        history.goBack();
        event.stopPropagation();
        // Clear potential accidental selection.
        document.getSelection().removeAllRanges();
    }, []);

    const shareArticle = useCallback(() => {
        if (!('share' in navigator))
            return;

        navigator.share({
            title: entry.title,
            url: getEntryUrl(entry)
        });
    }, [entry]);

    const content = currentView === "mozilla"
        ? entry && entry.mobilized && entry.mobilized.content
        : entry && getEntryContent(entry);

    useWhenChanged(() => {
        if (!domElement.current)
            return;
        const iframes = Array.from(domElement.current.querySelectorAll('iframe'));
        for (const frame of iframes) {
            const actualWidth = frame.getBoundingClientRect().width;
            const preferredWidth = parseInt(frame.width);
            const preferredHeight = parseInt(frame.height);

            let newHeight = preferredHeight;

            // If the width is a percentage, presumably it looks
            // good stretched out.
            if (!frame.width.endsWith('%')) {
                let aspectRatio = preferredWidth/preferredHeight;
                if (isNaN(aspectRatio))
                    aspectRatio = 4/3;
                newHeight = actualWidth/aspectRatio;
            }
            frame.setAttribute('style', `height: ${newHeight}px`);
        }
    }, [domElement.current, screenWidth, content]);

    if (!entry) {
        return <Centre>
            <CircularProgress />
        </Centre>;
    }

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
            {content !== undefined
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
                                onClick={() => setCurrentView("feedly")}>View Feedly</Button>
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
        {article}
        {active && <>
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

export default collect(EntryViewer);