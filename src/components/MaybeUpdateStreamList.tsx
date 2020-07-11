import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { getStore, getStreamUpdating, useStore } from '../hooks/store';
import useWhenChanged from '../hooks/useWhenChanged';
import { entryCount } from '../services/entryIterator';
import { setStreamList } from '../services/store';

interface Props {
    streamId: string;
}

const UpdateButton = (props: { streamId: string, unreadOnly: boolean }) => {
    const callback = useCallback(() =>
        setStreamList(props.unreadOnly, props.streamId)
        , [props.streamId, props.unreadOnly]);

    return <Button color="secondary" onClick={callback}>
        Show
    </Button>
}

export default (props: Props) => {
    useStore();
    const updatePromise = getStreamUpdating(props.streamId);


    useWhenChanged(async () => {
        // We're only interested in when the stream finishes
        // updating.
        if (updatePromise)
            return;

        const { unreadOnly } = getStore().stream;

        const newCount = await entryCount(unreadOnly, props.streamId);
        if (newCount > getStore().stream.length) {
            // Updates are available.
            window.snackHelper.enqueueSnackbar("New articles available!", {
                action: <UpdateButton streamId={props.streamId} unreadOnly={unreadOnly} />,
                autoHideDuration: 15000,
                key: 'articles-available',
                preventDuplicate: true,
            })
        }
    }, [!!updatePromise]);
    return <div>

    </div>
}