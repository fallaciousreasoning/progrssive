import { searchFeeds } from 'feedly/search';
import Button from 'components/Button';
import Centre from "components/Centre";
import ExportOpml from 'components/ExportOpml';
import ImportOpml from "components/ImportOpml";
import LoadingSpinner from "components/LoadingSpinner";
import StackPanel from "components/StackPanel";
import SubscriptionEditor from "components/SubscriptionEditor";
import TextField from "components/TextField";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueryParam } from "hooks/url";
import { guessFeedUrl, Subscription } from 'model/subscription';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDb } from "services/db";
import { toggleSubscription } from "services/subscriptions";
import { useDebounced } from '@/hooks/useDebounced';

const searchResultVariants = {
    initial: { opacity: 0, height: 0 },
    in: { opacity: 1, height: 'auto' },
    out: { opacity: 0, height: 0 }
};

const searchResultTransition = { duration: 0.3 };
const queryCache: { [query: string]: Subscription[] } = {}

export default function SubscriptionPage() {
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

    const { search: rawQueryString, setSearch: updateQueryString } = useQueryParam("search");
    const [search, setSearch] = useState(rawQueryString ?? '@subscribed');

    const debouncedSearchTerm = useDebounced(search, 200);
    const [searchResults, setSearchResults] = useState<Subscription[]>([]);
    const viewSubscriptions = useCallback(() => {
        setSearch('@subscribed');
    }, [setSearch]);

    const [isSearching, setIsSearching] = useState(false);

    // Update search results when typing.
    useEffect(() => {
        if (search !== rawQueryString) updateQueryString(search);

        // This is a special query.
        if (search.startsWith("@")) {
            if (search === "@subscribed")
                setSearchResults(subscriptions);

            if (search === "@import")
                setSearchResults(importingSubscriptions);
            setIsSearching(false);
            return;
        }

        if (!debouncedSearchTerm) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        if (queryCache[debouncedSearchTerm]) {
            setIsSearching(false);
            setSearchResults(queryCache[debouncedSearchTerm]);
            return;
        }

        if (debouncedSearchTerm !== search)
            return;

        let cancelled = false;
        setIsSearching(true);

        // Only set results if this search hasn't been cancelled.
        const finish = (results?: Subscription[]) => {
            // Cache for faster retrieval next time.
            if (results)
                queryCache[debouncedSearchTerm] = results;

            if (cancelled)
                return;
            setIsSearching(false);
            setSearchResults(results || []);
        }
        searchFeeds(debouncedSearchTerm).then(finish)
            .catch(() => finish());

        return () => {
            cancelled = true;
        }
    }, [debouncedSearchTerm,
        search,
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
        setSearch("@import");

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
            {!search.startsWith('@subscribed')
                && <Button key="current" variant="outline" color="primary" onClick={viewSubscriptions}>
                    Current Feeds
                </Button>}
            {!!subscriptions.length
                && <ExportOpml key="export" className="mb-2" />}
            {!search.startsWith("@import") && <ImportOpml key="import" className="mb-2"
                onOpmlLoaded={onLoadedOpml} />}
        </StackPanel>

        <div className="sticky top-2 z-10" >
            <TextField label="Search term or feed url" className="w-full" value={search} onChange={e => setSearch(e.target.value)}/>
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
            <span>
                There's nothing here.
            </span>
        </StackPanel>}
    </div>
};

