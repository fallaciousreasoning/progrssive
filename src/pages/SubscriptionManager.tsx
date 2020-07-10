import { Button, makeStyles, TextField, CircularProgress, Typography } from "@material-ui/core";
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useDebounce } from 'use-debounce';
import { searchFeeds } from '../api/search';
import ExportOpml from '../components/ExportOpml';
import ImportOpml from "../components/ImportOpml";
import StackPanel from "../components/StackPanel";
import SubscriptionEditor from "../components/SubscriptionEditor";
import { useStore } from '../hooks/store';
import { guessFeedUrl, Subscription } from '../model/subscription';
import { toggleSubscription } from "../services/subscriptions";
import Centre from "../components/Centre";

const useStyles = makeStyles(theme => ({
    opmlButton: {
        marginBottom: theme.spacing(1),
    },
    results: {
        paddingTop: '8px'
    },

    result: {
        padding: '8px'
    },

    loadingIndicator: {
        padding: '8px'
    },

    searchBox: {
        position: 'sticky',
        top: theme.spacing(1),
        background: theme.palette.background.paper,
        zIndex: 1
    }
}));

const searchResultVariants = {
    initial: { opacity: 0, height: 0},
    in: { opacity: 1, height: 'auto' },
    out: { opacity: 0, height: 0 }
};

const searchResultTransition = { staggerChildren: 0.2, duration: 0.5 };

export default (props) => {
    const styles = useStyles();
    const store = useStore();
    const history = useHistory();

    const getMatchingSubscription = useMemo(() => {
        const subscribedTo = new Map(store.subscriptions.map(s => [s.id, s]));
        return (s: Subscription) => subscribedTo.get(s && s.id);
    }, [store.subscriptions]);

    const isSubscribed = useMemo(() =>
        (s: Subscription) => !!getMatchingSubscription(s),
        [getMatchingSubscription]);

    const [importingSubscriptions, setImportingSubscriptions] = useState<Subscription[]>([]);
    const isImporting = useMemo(() => {
        const subscribedTo = new Set(importingSubscriptions.map(s => s.id));
        return (s: Subscription) => subscribedTo.has(s.id);
    }, [importingSubscriptions]);

    const queryParams = new URLSearchParams(window.location.search);
    const [query, setQuery] = useState(queryParams.has('query')
        ? queryParams.get('query')
        : "@subscribed");
    const [debouncedQuery] = useDebounce(query, 200);
    const [searchResults, setSearchResults] = useState<Subscription[]>([]);
    const viewSubscriptions = useCallback(() => {
        setQuery("@subscribed");
    }, [setQuery]);

    const [isSearching, setIsSearching] = useState(false);

    // Update search results when typing.
    useEffect(() => {
        history.replace(`?query=${encodeURIComponent(query)}`);

        // This is a special query.
        if (query.startsWith("@")) {
            if (query === "@subscribed")
                setSearchResults(store.subscriptions);

            if (query === "@import")
                setSearchResults(importingSubscriptions);
            return;
        }

        if (!debouncedQuery) {
            setSearchResults([]);
            return;
        }

        if (debouncedQuery !== query)
            return;

        let cancelled = false;
        setIsSearching(true);

        // Only set results if this search hasn't been cancelled.
        const finish = (results: Subscription[]) => {
            if (cancelled)
                return;
            setIsSearching(false);
            setSearchResults(results);
        }
        searchFeeds(debouncedQuery).then(finish)
            .catch(() => finish([]));

        return () => {
            cancelled = true;
        }
    }, [debouncedQuery,
        query,
        history,
        importingSubscriptions,
        store.subscriptions,
        getMatchingSubscription]);

    const onLoadedOpml = useCallback(async (toImport: Subscription[]) => {
        toImport = toImport
            // If we already know about this subscription, use that one,
            // otherwise fall back to the one we need to import.
            .map(importing => isSubscribed(importing)
                ? importing
                : {
                    ...importing,
                    importStatus: 'pending'
                });
        setImportingSubscriptions(toImport);
        setQuery("@import");

        // Find a matching subscription, one by one.
        for (let i = 0; i < toImport.length; ++i) {
            const importing = toImport[i];
            const similar = await searchFeeds(guessFeedUrl(importing))
                .catch(() => []);
            const bestMatch = similar[0];

            // We couldn't find anything similar :'(
            if (!bestMatch) {
                // TODO: Set status to failed?
                // Let react know we have more info.
                toImport[i] = {
                    ...toImport[i],
                    importStatus: 'failed'
                };
                setImportingSubscriptions([...toImport]);
                continue;
            }

            // Update the list with the match from feedly
            // and let React know it's changed.
            toImport[i] = bestMatch;
            setImportingSubscriptions([...toImport]);
        }
    }, [setImportingSubscriptions,
        getMatchingSubscription]);

    // Where possible, use results from the store, so we can edit them.
    const storeOrSearchResults = searchResults.map(s => getMatchingSubscription(s) || s);
    return <div>
        <StackPanel direction='row' animatePresence>
            {!query.startsWith('@subscribed')
                && <Button key="current" variant="outlined" color="primary" onClick={viewSubscriptions}>
                    Current Feeds
            </Button>}
            {!!store.subscriptions.length
                && <ExportOpml key="export" className={styles.opmlButton} />}
            {!query.startsWith("@import") && <ImportOpml key="import" className={styles.opmlButton}
                onOpmlLoaded={onLoadedOpml} />}
        </StackPanel>

        <TextField
            label="Search term or feed url"
            variant="filled"
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchBox} />

        {isSearching && <Centre>
            <CircularProgress
                className={styles.loadingIndicator}
                variant="indeterminate" />
        </Centre>}
        <StackPanel variants={searchResultVariants}
            transition={searchResultTransition}
            className={styles.results}>
            {storeOrSearchResults.map(s => <SubscriptionEditor
                key={s.id}
                subscription={s}
                isSubscribed={isSubscribed(s)}
                isImporting={isImporting(s)}
                toggleSubscription={toggleSubscription} />)}
        </StackPanel>
        {!isSearching && storeOrSearchResults.length === 0 && <StackPanel>
            <Typography>
                There's nothing here.
            </Typography>
        </StackPanel>}
    </div>
}

