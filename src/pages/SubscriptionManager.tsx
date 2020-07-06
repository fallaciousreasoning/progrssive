import { makeStyles, TextField } from "@material-ui/core";
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { searchFeeds } from '../api/search';
import ExportOpml, { getSubscriptionsOpml } from '../components/ExportOpml';
import ImportOpml from "../components/ImportOpml";
import StackPanel from "../components/StackPanel";
import { getStore, useStore } from '../hooks/store';
import { Subscription } from '../model/subscription';
import { save } from '../services/persister';
import SubscriptionEditor from "../components/SubscriptionEditor";

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

window['opml'] = getSubscriptionsOpml;
export const SubscriptionManager = (props) => {
    const styles = useStyles();
    const store = useStore();

    const isSubscribed = useMemo(() => (s: Subscription) => {
        const subscribedTo = new Set(store.subscriptions.map(s => s.id));
        return subscribedTo.has(s.id)
    }, [store.subscriptions]);

    const [query, setQuery] = useState("@subscribed");
    const [debouncedQuery] = useDebounce(query, 200);
    const [searchResults, setSearchResults] = useState([]);

    // Update search results when typing.
    useEffect(() => {
        if (!debouncedQuery) {
            setSearchResults([]);
            return;
        }

        if (debouncedQuery !== query)
            return;

        // This is a special query.
        if (query.startsWith("@"))
            return;

        searchFeeds(debouncedQuery).then(setSearchResults);
    }, [debouncedQuery, query]);

    const subscriptions = query === "@subscribed"
        ? store.subscriptions
        : searchResults;

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

    return <div>
        <TextField
            label="Search term or feed url"
            variant="filled"
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)} />

        <div className={styles.results}>
            {subscriptions.map(s => <SubscriptionEditor
                key={s.id}
                subscription={s}
                isSubscribed={isSubscribed(s)}
                toggleSubscription={toggleSubscription} />)}
        </div>

        <StackPanel direction='row'>
            {!!store.subscriptions.length
                && <ExportOpml className={styles.opmlButton} />}
            <ImportOpml className={styles.opmlButton}
                onOpmlLoaded={console.log}/>
        </StackPanel>

    </div>
}

