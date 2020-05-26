import * as React from 'react';
import { makeStyles, TextField, Card, CardMedia, IconButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core"
import { useState, useEffect, useCallback } from 'react';
import { useStore, getStore } from './hooks/store';
import { Subscription } from './model/subscription';
import { Add, Delete } from '@material-ui/icons';
import { searchFeeds } from './api/search';
import { useDebounce } from 'use-debounce';
import { save } from './services/persister';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    content: {
        padding: '8px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '90vh',
        overflowY: 'auto'
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
                toggleSubscription={toggleSubscription} />)}
        </div>
    </div>
}

const useCardStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        cursor: 'pointer'
    },
    icon: {
        width: 150,
        alignSelf: 'stretch'
    },
    content: {
        marginLeft: theme.spacing(1),
        flexGrow: 1,
        padding: theme.spacing(1)
    },
    viewPicker: {
        marginTop: theme.spacing(1)
    },
    controls: {
        marginLeft: theme.spacing(1)
    }
}));

const SubscriptionView = (props: {
    subscription: Subscription,
    isSubscribed?: boolean,
    toggleSubscription: (s: Subscription) => void
}) => {
    const styles = useCardStyles();

    const toggleSubscription = useCallback((e) => {
        e.stopPropagation();
        props.toggleSubscription(props.subscription);
    }, [props.toggleSubscription, props.subscription]);

    const history = useHistory();
    const viewStream = useCallback(() => {
        // history.push(`/stream/${props.subscription.id}`);
    }, [props.subscription.id, history]);

    const preferredViewChanged = useCallback(async (e) => {
        props.subscription.preferredView = e.target.value;
        await save('subscriptions', getStore().subscriptions)
    }, [props.subscription]);

    return <Card className={styles.root} onClick={viewStream}>
        <CardMedia className={styles.icon}
            image={props.subscription.visualUrl || props.subscription.iconUrl} />
        <div className={styles.content}>
            <div>
                <b>{props.subscription.title}</b>
            </div>
            {props.isSubscribed && <div>
                <FormControl fullWidth className={styles.viewPicker}>
                    <InputLabel>Preferred View</InputLabel>
                    <Select
                        onChange={preferredViewChanged}
                        value={props.subscription.preferredView || "feedly"}>
                        <MenuItem value="feedly">Feedly Mobilizer</MenuItem>
                        <MenuItem value="browser">Browser</MenuItem>
                    </Select>
                </FormControl>
            </div>}
        </div>
        <div className={styles.controls}>
            <IconButton onClick={toggleSubscription}>
                {props.isSubscribed
                    ? <Delete />
                    : <Add />
                }
            </IconButton>
        </div>
    </Card>
}