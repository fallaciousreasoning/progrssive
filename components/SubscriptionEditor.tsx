import IconButton from './IconButton';
import Add from '../icons/add.svg';
import Delete from '../icons/delete.svg';
import ErrorIcon from '../icons/error.svg';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { Subscription } from '../model/subscription';
import { saveSubscription } from '../services/db';
import LoadingSpinner from './LoadingSpinner';
import Select from './Select';

interface Props {
    subscription: Subscription,
    isSubscribed?: boolean,
    isImporting?: boolean,
    toggleSubscription: (s: Subscription) => void
}

const SubscriptionControls = (props: Props) => {
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
        return <div className="fill-current text-red-400 mr-1">
            <ErrorIcon />
        </div>;
    }

    return progress;
}

const mobilizers: Subscription["preferredView"][] = ["feedly", "mozilla", "browser"];
const SubscriptionEditor = (props: Props) => {
    const router = useRouter();
    const viewStream = useCallback(() => {
        router.push(`/stream/${encodeURIComponent(props.subscription.id)}`);
    }, [props.subscription.id, router]);

    const preferredViewChanged = useCallback(async (newValue: Subscription['preferredView']) => {
        await saveSubscription({
            ...props.subscription,
            preferredView: newValue
        });
    }, [props.subscription]);

    const visualUrl = props.subscription.visualUrl || props.subscription.iconUrl;

    return <div className="flex h-32 items-center mb-2 rounded-md shadow bg-paper">
        <div className="w-24 h-full self-stretch">
            {visualUrl && <img src={visualUrl} alt="Source logo" className="rounded-l-md h-full w-full object-cover" />}
        </div>
        <div className="mx-2 flex-grow p-2">
            <div onClick={viewStream} className="cursor-pointer">
                <b>{props.subscription.title}</b>
            </div>
            {props.isSubscribed && !props.subscription.deleting && <div className="mt-2">
                <label>Preferred View</label>
                <Select
                    className="w-full capitalize border-none focus:border bg-input"
                    onChange={preferredViewChanged}
                    items={mobilizers}
                    value={props.subscription.preferredView || 'feedly'}
                    renderValue={i => i} renderItem={i => i} />
            </div>}
        </div>
        <div className="ml-2">
            <SubscriptionControls {...props} />
        </div>
    </div>
};

export default SubscriptionEditor;