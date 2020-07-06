import { makeStyles, TextField, Button } from "@material-ui/core";
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useDebounce } from 'use-debounce';
import { searchFeeds } from '../api/search';
import ExportOpml from '../components/ExportOpml';
import ImportOpml from "../components/ImportOpml";
import StackPanel from "../components/StackPanel";
import SubscriptionEditor from "../components/SubscriptionEditor";
import { getStore, useStore } from '../hooks/store';
import { Subscription, guessFeedUrl } from '../model/subscription';
import { save } from '../services/persister';

const useStyles = makeStyles(theme => ({
    opmlButton: {
        marginBottom: theme.spacing(1),
    },
    results: {
        paddingTop: '8px'
    },

    result: {
        padding: '8px'
    }
}));

export const SubscriptionManager = (props) => {
    const styles = useStyles();
    const store = useStore();
    const history = useHistory();

    const getMatchingSubscription = useMemo(() => {
        const subscribedTo = new Map(store.subscriptions.map(s => [s.id, s]));
        return (s: Subscription) => subscribedTo.get(s.id);
    }, [store.subscriptions]);

    const isSubscribed = useMemo(() =>
        (s: Subscription) => !!getMatchingSubscription(s),
        [getMatchingSubscription]);

    const [importingSubscriptions, setImportingSubscriptions] = useState<Subscription[]>([]);
    const isImporting = useMemo(() => {
        const subscribedTo = new Set(importingSubscriptions.map(s => s.id));
        return (s: Subscription) => subscribedTo.has(s.id);
    }, [importingSubscriptions])

    const queryParams = new URLSearchParams(window.location.search);
    const [query, setQuery] = useState(queryParams.get('query') || "@subscribed");
    const [debouncedQuery] = useDebounce(query, 200);
    const [searchResults, setSearchResults] = useState<Subscription[]>([]);

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

        searchFeeds(debouncedQuery).then(setSearchResults);
    }, [debouncedQuery,
        query,
        history,
        importingSubscriptions,
        store.subscriptions]);

    // Toggles whether a subscription is active.
    const toggleSubscription = useCallback(async subscription => {
        if (isSubscribed(subscription)) {
            const newSubs = [...store.subscriptions];
            const index = newSubs.findIndex(s => s.id === subscription.id);
            newSubs.splice(index, 1);
            store.subscriptions = newSubs;
        } else {
            store.subscriptions = [...store.subscriptions, subscription];
        }
        await save('subscriptions', getStore().subscriptions);
    }, [store.subscriptions, isSubscribed]);

    const onLoadedOpml = useCallback(async (toImport: Subscription[]) => {
        toImport = toImport
            // If we already know about this subscription, use that one,
            // otherwise fall back to the one we need to import.
            .map(importing => getMatchingSubscription(importing)
                || {
                ...importing,
                importStatus: 'pending'
            });
        setImportingSubscriptions(toImport);
        setQuery("@import");

        // Find a matching subscription, one by one.
        for (let i = 0; i < toImport.length; ++i) {
            const importing = toImport[i];
            const similar = await searchFeeds(guessFeedUrl(importing));
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
        getMatchingSubscription,
        store.subscriptions]);

    return <div>
        <StackPanel direction='row' animatePresence>
            {!query.startsWith('@subscribed') && <Button variant="outlined" color="primary">
                Current Feeds
        </Button>}
            {!!store.subscriptions.length
                && <ExportOpml className={styles.opmlButton} />}
            {!query.startsWith("@import") && <ImportOpml className={styles.opmlButton}
                onOpmlLoaded={onLoadedOpml} />}
        </StackPanel>

        <TextField
            label="Search term or feed url"
            variant="filled"
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)} />

        <div className={styles.results}>
            {searchResults.map(s => <SubscriptionEditor
                key={s.id}
                subscription={s}
                isSubscribed={isSubscribed(s)}
                isImporting={isImporting(s)}
                toggleSubscription={toggleSubscription} />)}
        </div>
    </div>
}

