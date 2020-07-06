import React, { useCallback, useEffect } from 'react'
import { Subscription } from '../model/subscription';
import { makeStyles, Card, CardMedia, FormControl, InputLabel, Select, MenuItem, IconButton, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { getStore } from '../hooks/store';
import { save } from '../services/persister';
import { Delete, Add, Error as ErrorIcon } from '@material-ui/icons';

const useCardStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        minHeight: '48px'
    },
    title: {
        cursor: 'pointer'
    },
    icon: {
        width: 150,
        alignSelf: 'stretch',
        '&> *': {
            width: '100%',
            height: '100%'
        }
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
        marginLeft: theme.spacing(1),
    },
    errorIcon: {
        marginRight: theme.spacing(1.5),
        color: theme.palette.error.main
    }
}));

export default (props: {
    subscription: Subscription,
    isSubscribed?: boolean,
    isImporting?: boolean,
    toggleSubscription: (s: Subscription) => void
}) => {
    const styles = useCardStyles();

    const toggleSubscription = useCallback((e) => {
        e.stopPropagation();
        props.toggleSubscription(props.subscription);
    }, [props]);

    const history = useHistory();
    const viewStream = useCallback(() => {
        history.push(`/stream/${props.subscription.id}`);
    }, [props.subscription.id, history]);

    const preferredViewChanged = useCallback(async (e) => {
        props.subscription.preferredView = e.target.value;
        await save('subscriptions', getStore().subscriptions)
    }, [props.subscription]);

    const visualUrl = props.subscription.visualUrl || props.subscription.iconUrl;

    let controls: React.ReactNode;
    if (!props.subscription.importStatus) {
        controls = <IconButton onClick={toggleSubscription}>
            {props.isSubscribed
                ? <Delete />
                : <Add />
            }
        </IconButton>;
    } else if (props.subscription.importStatus == 'failed') {
        controls = <div className={styles.errorIcon}>
            <ErrorIcon/>
        </div>
    } else {
        controls = <CircularProgress variant='indeterminate'/>
    }
    return <Card className={styles.root}>
        <div className={styles.icon}>
            {visualUrl && <CardMedia
                image={visualUrl} />}
        </div>
        <div className={styles.content}>
            <div onClick={viewStream} className={styles.title}>
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
            {controls}
        </div>
    </Card>
}