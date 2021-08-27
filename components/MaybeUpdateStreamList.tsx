import Button from 'components/Button';
import React, { useCallback } from 'react';
import { collect } from 'react-recollect';
import { getStore, getStreamUpdating } from '../hooks/store';
import useWhenChanged from '../hooks/useWhenChanged';
import { entryCount } from '../services/entryIterator';
import { setStreamList } from '../services/store';
import { CollectProps } from '../types/RecollectStore';
import { ToastProps } from './Toasts';

interface Props {
    streamId: string;
}

const SNACK_KEY = 'articles-available';
const UpdateButton = (props: ToastProps) => {
    const callback = useCallback(() => {
        const stream = getStore().stream;
        setStreamList(stream.unreadOnly, stream.id, /*force=*/true);
        props.dismiss();
    }, []);

    return <Button compact color="secondary" onClick={callback}>
        Show
    </Button>
}

export default collect((props: Props & CollectProps) => {
    const loading = !!getStreamUpdating(props.streamId);

    useWhenChanged(async () => {
        // We're only interested when the stream finishes
        // loading.
        if (loading)
            return;

        const { unreadOnly } = props.store.stream;
        const streamLength = props.store.stream.length;

        // We're still reading from disk.
        if (streamLength === undefined)
            return;

        const newCount = await entryCount(unreadOnly, props.streamId);
        // No new articles.
        if (newCount <= streamLength)
            return;

        // We have articles now, and we didn't before.
        if (streamLength === 0) {
            // So automatically load in the new articles,
            // as there isn't any risk of losing our spot.
            setStreamList(unreadOnly, props.streamId, /*force=*/true);
            return;
        }

        // Updates are available, ask the user if they
        // want to see them.
        window.showToast({
            message: "New articles available!",
            action: props => <UpdateButton {...props} />,
            duration: 15000,
            id: SNACK_KEY,
        });
    }, [loading]);
    return null;
});