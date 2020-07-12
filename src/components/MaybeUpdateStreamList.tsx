import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { getStore, getStreamUpdating, useStore } from '../hooks/store';
import useWhenChanged from '../hooks/useWhenChanged';
import { entryCount } from '../services/entryIterator';
import { setStreamList } from '../services/store';

interface Props {
    streamId: string;
}

const SNACK_KEY = 'articles-available';
const UpdateButton = () => {
    const callback = useCallback(() => {
        const stream = getStore().stream;
        setStreamList(stream.unreadOnly, stream.id, /*force=*/true);
        window.snackHelper.closeSnackbar(SNACK_KEY);
    }, []);

    return <Button color="secondary" onClick={callback}>
        Show
    </Button>
}

export default (props: Props) => {
    useStore();
    const loading = !!getStreamUpdating(props.streamId);

    useWhenChanged(async () => {
        // We're only interested when the stream finishes
        // loading.
        if (loading)
            return;

        const { unreadOnly } = getStore().stream;

        const streamLength = getStore().stream.length;

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
        window.snackHelper.enqueueSnackbar("New articles available!", {
            action: <UpdateButton />,
            autoHideDuration: 15000,
            key: SNACK_KEY,
            preventDuplicate: true,
        });
    }, [loading]);
    return null;
}