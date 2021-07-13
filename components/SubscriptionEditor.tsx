import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { Subscription } from '../model/subscription';
import { saveSubscription } from '../services/db';
import LoadingSpinner from './LoadingSpinner';

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
}));

const SubscriptionControls = (props: Props) => {
    const styles = useControlStyles();
    const toggleSubscription = useCallback((e) => {
        e.stopPropagation();
        props.toggleSubscription(props.subscription);
    }, [props]);

    const progress = <LoadingSpinner
        size={6}
        className="mr-1" />;

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
            <div className={`${styles.errorIcon} mr-1`}>
                <ErrorIcon />
            </div>
        </Tooltip>
    }

    return progress;
}

const SubscriptionEditor = (props: Props) => {
    const router = useRouter();
    const viewStream = useCallback(() => {
        router.push(`/stream/${encodeURIComponent(props.subscription.id)}`);
    }, [props.subscription.id, router]);

    const preferredViewChanged = useCallback(async (e) => {
        await saveSubscription({ 
            ...props.subscription,
            preferredView: e.target.value
        });
    }, [props.subscription]);

    const visualUrl = props.subscription.visualUrl || props.subscription.iconUrl;

    return <div className="flex items-center mb-2 rounded-md overflow-hidden shadow">
        <div className="w-24 h-24 self-stretch">
            {visualUrl && <img src={visualUrl} alt="Source logo"/>}
        </div>
        <div className="mx-2 flex-grow p-2">
            <div onClick={viewStream} className="cursor-pointer">
                <b>{props.subscription.title}</b>
            </div>
            {props.isSubscribed && !props.subscription.deleting && <div>
                <FormControl className="w-full mt-2">
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
        <div className="ml-2">
            <SubscriptionControls {...props} />
        </div>
    </div>
};

export default SubscriptionEditor;