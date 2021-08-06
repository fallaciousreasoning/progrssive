import { TextField, Typography } from "@material-ui/core";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from 'next/router';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { searchFeeds } from 'api/search';
import Button from 'components/Button';
import Centre from "components/Centre";
import ExportOpml from 'components/ExportOpml';
import ImportOpml from "components/ImportOpml";
import LoadingSpinner from "components/LoadingSpinner";
import StackPanel from "components/StackPanel";
import SubscriptionEditor from "components/SubscriptionEditor";
import { guessFeedUrl, Subscription } from 'model/subscription';
import { getDb } from "services/db";
import { toggleSubscription } from "services/subscriptions";

const searchResultVariants = {
    initial: { opacity: 0, height: 0 },
    in: { opacity: 1, height: 'auto' },
    out: { opacity: 0, height: 0 }
};

const searchResultTransition = { duration: 0.3 };
const queryCache: { [query: string]: Subscription[] } = {}

export default function SubscriptionPage() {
    const router = useRouter();

    const subscriptions = useLiveQuery(async () => {
        const db = await getDb();
        return db.subscriptions.toArray();
    }) ?? [];

    const getMatchingSubscription = useMemo(() => {
        const subscribedTo = new Map(subscriptions.map(s => [s.id, s]));
        return (s: Subscription) => subscribedTo.get(s?.id);
    }, [subscriptions]);

    const isSubscribed = useMemo(() =>
        (s: Subscription) => !!getMatchingSubscription(s),
        [getMatchingSubscription]);

    const [importingSubscriptions, setImportingSubscriptions] = useState<Subscription[]>([]);
    const isImporting = useMemo(() => {
        const subscribedTo = new Set(importingSubscriptions.map(s => s.id));
        return (s: Subscription) => subscribedTo.has(s.id);
    }, [importingSubscriptions]);

    const queryParams = router.query;
    const [query, setQuery] = useState(queryParams['query']?.[0] ?? "@subscribed");
    const [debouncedQuery] = useDebounce(query, 200);
    const [searchResults, setSearchResults] = useState<Subscription[]>([]);
    const viewSubscriptions = useCallback(() => {
        setQuery("@subscribed");
    }, [setQuery]);

    const [isSearching, setIsSearching] = useState(false);

    // Update search results when typing.
    useEffect(() => {
        if (query !== queryParams['query'])
            router.replace(`/subscriptions?query=${encodeURIComponent(query)}`);
        // This is a special query.
        if (query.startsWith("@")) {
            if (query === "@subscribed")
                setSearchResults(subscriptions);

            if (query === "@import")
                setSearchResults(importingSubscriptions);
            setIsSearching(false);
            return;
        }

        if (!debouncedQuery) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        if (queryCache[debouncedQuery]) {
            setIsSearching(false);
            setSearchResults(queryCache[debouncedQuery]);
            return;
        }

        if (debouncedQuery !== query)
            return;

        let cancelled = false;
        setIsSearching(true);

        // Only set results if this search hasn't been cancelled.
        const finish = (results?: Subscription[]) => {
            // Cache for faster retreival next time.
            if (results)
                queryCache[debouncedQuery] = results;

            if (cancelled)
                return;
            setIsSearching(false);
            setSearchResults(results || []);
        }
        searchFeeds(debouncedQuery).then(finish)
            .catch(() => finish());

        return () => {
            cancelled = true;
        }
    }, [debouncedQuery,
        query,
        history,
        importingSubscriptions,
        subscriptions,
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
        getMatchingSubscription,
        isSubscribed]);

    // Where possible, use results from the store, so we can edit them.
    const storeOrSearchResults = searchResults.map(s => getMatchingSubscription(s) || s);
    return <div>

        <StackPanel direction='row' animatePresence>
            {!query.startsWith('@subscribed')
                && <Button key="current" variant="outline" color="primary" onClick={viewSubscriptions}>
                    Current Feeds
                </Button>}
            {!!subscriptions.length
                && <ExportOpml key="export" className="mb-2" />}
            {!query.startsWith("@import") && <ImportOpml key="import" className="mb-2"
                onOpmlLoaded={onLoadedOpml} />}
        </StackPanel>

        <div className="sticky top-2 z-10" >
            <TextField
                label="Search term or feed url"
                variant="filled"
                fullWidth
                value={query}
                onChange={e => setQuery(e.target.value)}/>
        </div>

        {isSearching && <Centre>
            <LoadingSpinner className="p-2" />
        </Centre>}
        <StackPanel variants={searchResultVariants}
            transition={searchResultTransition}
            className="pt-2">
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
};

