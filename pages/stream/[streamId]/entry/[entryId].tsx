import { CardContent, CardHeader, makeStyles, Typography } from "@material-ui/core";
import IconButton from 'components/IconButton'
import Button from 'components/Button'
import Share from "../../../../icons/share.svg";
import { useRouter } from "next/router";
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { collect, Store } from "react-recollect";
import { loadMobilizedContent } from "actions/entry";
import AppBarButton from "components/AppBarButton";
import Centre from "components/Centre";
import LoadingSpinner from "components/LoadingSpinner";
import { EntryReadButton } from "components/MarkerButton";
import PreferredViewMenu from "components/PreferredViewMenu";
import StackPanel from "components/StackPanel";
import { useDoubleTap } from "hooks/callbacks";
import { useEntry } from "hooks/entry";
import { useScreenSize } from "hooks/screenSize";
import { useEntryId } from "hooks/url";
import useWhenChanged from "hooks/useWhenChanged";
import { getEntryByline, getEntryContent, getEntryUrl, useViewMode } from "services/entry";
import { useSettings } from 'services/settings';
import 'types/Window';
import LinkButton from "components/LinkButton";

const useStyles = makeStyles(theme => ({
    '@global': {
        'article': {
            color: theme.palette.text.primary
        },
        'article a': {
            color: theme.palette.info.main
        }
    }
}));

const EntryViewer = (props: { store: Store }) => {
    const router = useRouter();
    const entryId = useEntryId();
    useStyles();
    const domElement = useRef<HTMLDivElement>(null);
    const entry = useEntry(entryId, props.store);
    const url = getEntryUrl(entry);
    const active = router.pathname.includes("/entry/");
    const [currentView, setCurrentView] = useViewMode(entry);
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
    }, [entryId]);

    const preferredViewChanged = useCallback(view => {
        if (view === "browser") {
            window.open(url, "_blank");
            return;
        }

        setCurrentView(view);
    }, [url]);

    useWhenChanged(() => {
        // We haven't tried to mobilize yet.
        setFailedToMobilize(false);

        // Mozilla mobilization is asynchronous.
        if (currentView === "mozilla") {
            loadMobilizedContent(entryId)
                .catch(() => {
                    setFailedToMobilize(true);
                    window.snackHelper.enqueueSnackbar("Failed to mobilize article! Are you offline?");
                });
        }
    }, [currentView, entryId, !!entry]);

    const doubleTap = useDoubleTap((event) => {
        if (!settings.doubleTapToCloseArticles)
            return;

        router.back();
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
                let aspectRatio = preferredWidth / preferredHeight;
                if (isNaN(aspectRatio))
                    aspectRatio = 4 / 3;
                newHeight = actualWidth / aspectRatio;
            }
            frame.setAttribute('style', `height: ${newHeight}px`);
        }
    }, [domElement.current, screenWidth, content]);

    if (!entry) {
        return <Centre>
            <LoadingSpinner />
        </Centre>;
    }

    const title = url
        ? <a
            target="_blank"
            rel="noopener noreferrer"
            href={url}
            className="no-underline">
            {entry.title}
        </a>
        : entry.title;

    const article = <div>
        <div className="flex flex-col mb-3">
            <h2 className="text-xl">{title}</h2>
            <span className="text-base text-gray-500">{getEntryByline(entry)}</span>
        </div>
        {content !== undefined
            ? <div className="text-sm" dangerouslySetInnerHTML={{ __html: content }}></div>
            : <StackPanel alignItems='center'>
                <div className="text-sm">
                    {failedToMobilize
                        ? "Failed to mobilize article."
                        : "Mobilizing..."}
                </div>
                {failedToMobilize
                    ? <StackPanel direction="row">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentView("feedly")}>View Feedly</Button>
                        <LinkButton
                            href={url}>
                            Open in Browser
                        </LinkButton>
                    </StackPanel>
                    : <LoadingSpinner />}

            </StackPanel>}
    </div>;

    return <article className="mx-auto max-w-3xl" ref={domElement} onClick={doubleTap}>
        {article}
        {active && <>
            {!entry.transient && <AppBarButton>
                <EntryReadButton entryId={entry.id} />
            </AppBarButton>}
            {navigator.share && <AppBarButton>
                <IconButton
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