import * as React from 'react';
import { makeStyles, TextField, Card, CardMedia, IconButton } from "@material-ui/core"
import { useState, useEffect, useCallback } from 'react';
import { useStore, getStore } from './hooks/store';
import { Subscription } from './model/subscription';
import { Add, Delete } from '@material-ui/icons';
import { searchFeeds } from './api/search';
import { useDebounce } from 'use-debounce';
import { save } from './services/persister';

const useStyles = makeStyles({
    content: {
        padding: '8px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    results: {
        paddingTop: '8px'
    },

    result: {
        padding: '8px'
    }
});
export const SubscriptionManager = (props) => {
    const styles = useStyles();
    const store = useStore();
    const subscribedTo = new Set(store.subscriptions.map(s => s.id));
    const isSubscribed = s => subscribedTo.has(s.id)

    const [query, setQuery] = useState("@subscribed");
    const [debouncedQuery] = useDebounce(query, 200);
    const [searchResults, setSearchResults] = useState([]);

    // Update search results when typing.
    useEffect(() => {
        if (!debouncedQuery) {
            setSearchResults([]);
            return;
        }

        // This is a special query.
        if (query.startsWith("@"))
            return;

        searchFeeds(debouncedQuery).then(setSearchResults);
    }, [debouncedQuery]);

    const subscriptions = query == "@subscribed"
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
    }, [store.subscriptions]);

    return <div className={styles.content}>
        <TextField
            label="Search term or feed url"
            variant="filled"
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)} />

        <div className={styles.results}>
            {subscriptions.map(s => <SubscriptionView
                key={s.id}
                subscription={s}
                isSubscribed={isSubscribed(s)}
                toggleSubscription={toggleSubscription}/>)}
        </div>
    </div>
}

const useCardStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    },
    icon: {
        width: 150,
        alignSelf: 'stretch'
    },
    content: {
        marginLeft: '8px',
        flexGrow: 1
    },
    controls: {
        marginLeft: '8px'
    }
});

const SubscriptionView = (props: {
    subscription: Subscription,
    isSubscribed?: boolean,
    toggleSubscription: (s: Subscription) => void
}) => {
    const styles = useCardStyles();

    return <Card className={styles.root}>
        <CardMedia className={styles.icon}
            image={props.subscription.visualUrl || props.subscription.iconUrl}/>
        <div className={styles.content}>
            {props.subscription.title}
        </div>
        <div className={styles.controls}>
            <IconButton onClick={() => props.toggleSubscription(props.subscription)}>
                {props.isSubscribed
                    ? <Delete/>
                    : <Add/>
                }
            </IconButton>
        </div>
    </Card>
}