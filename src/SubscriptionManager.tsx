import * as React from 'react';
import { TextField, Card, CardMedia, IconButton } from "@material-ui/core"
import { useState, useEffect } from 'react';
import { useStore, getStore } from './hooks/store';
import { makeStyles } from '@material-ui/styles';
import { Subscription } from './model/subscription';
import { Add, Delete } from '@material-ui/icons';

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
    const [searchResults, setSearchResults] = useState([]);

    // Update search results when typing.
    useEffect(() => {
        // This is a special query.
        if (query.startsWith("@"))
            return;


    }, [query]);

    const subscriptions = query == "@subscribed"
        ? store.subscriptions
        : searchResults;

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
                isSubscribed={isSubscribed(s)}/>)}
        </div>
    </div>
}

const useCardStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center'
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
    isSubscribed?: boolean
}) => {
    const styles = useCardStyles();

    return <Card className={styles.root}>
        <CardMedia className={styles.icon}
            image={props.subscription.visualUrl || props.subscription.iconUrl}/>
        <div className={styles.content}>
            {props.subscription.title}
        </div>
        <div className={styles.controls}>
            <IconButton>
                {props.isSubscribed
                    ? <Delete/>
                    : <Add/>
                }
            </IconButton>
        </div>
    </Card>
}