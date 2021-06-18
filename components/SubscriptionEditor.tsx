import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Subscription } from '../model/subscription';
import { saveSubscription } from '../services/db';

interface Props {
    subscription: Subscription,
    isSubscribed?: boolean,
    isImporting?: boolean,
    toggleSubscription: (s: Subscription) => void
}

const useControlStyles = makeStyles(theme => ({
    errorIcon: {
        color: theme.palette.error.main
    },
    statusIndicator: {
        marginRight: theme.spacing(1.5)
    }
}));

const SubscriptionControls = (props: Props) => {
    const styles = useControlStyles();
    const toggleSubscription = useCallback((e) => {
        e.stopPropagation();
        props.toggleSubscription(props.subscription);
    }, [props]);

    const progress = <CircularProgress
        size={24}
        variant='indeterminate'
        className={styles.statusIndicator} />;

    if (props.subscription.deleting)
        return progress;

    if (!props.subscription.importStatus) {
        return <IconButton onClick={toggleSubscription}>
            {props.isSubscribed
                ? <Delete />
                : <Add />
            }
        </IconButton>;
    }

    if (props.subscription.importStatus === 'failed') {
        return <Tooltip title={`Couldn't find a feed for ${props.subscription.feedUrl}`}>
            <div className={`${styles.errorIcon} ${styles.statusIndicator}`}>
                <ErrorIcon />
            </div>
        </Tooltip>
    }

    return progress;
}

const useEditorStyles = makeStyles(theme => ({
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
    }
}));

export default (props: Props) => {
    const styles = useEditorStyles();

    const history = useHistory();
    const viewStream = useCallback(() => {
        history.push(`/stream/${encodeURIComponent(props.subscription.id)}`);
    }, [props.subscription.id, history]);

    const preferredViewChanged = useCallback(async (e) => {
        props.subscription.preferredView = e.target.value;
        // Copy everything to a new object, to not deal with Proxy craziness.
        await saveSubscription({ ...props.subscription, preferredView: props.subscription.preferredView })
    }, [props.subscription]);

    const visualUrl = props.subscription.visualUrl || props.subscription.iconUrl;

    return <Card className={styles.root}>
        <div className={styles.icon}>
            {visualUrl && <CardMedia
                image={visualUrl} />}
        </div>
        <div className={styles.content}>
            <div onClick={viewStream} className={styles.title}>
                <b>{props.subscription.title}</b>
            </div>
            {props.isSubscribed && !props.subscription.deleting && <div>
                <FormControl fullWidth className={styles.viewPicker}>
                    <InputLabel>Preferred View</InputLabel>
                    <Select
                        onChange={preferredViewChanged}
                        value={props.subscription.preferredView || "feedly"}>
                        <MenuItem value="feedly">Feedly Mobilizer</MenuItem>
                        <MenuItem value="browser">Browser</MenuItem>
                        <MenuItem value="mozilla">Mozilla Readability</MenuItem>
                    </Select>
                </FormControl>
            </div>}
        </div>
        <div className={styles.controls}>
            <SubscriptionControls {...props} />
        </div>
    </Card>
}