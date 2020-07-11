import React, { useState } from 'react'
import { getStreamUpdating, useStore, getStore } from '../hooks/store';
import useWhenChanged from '../hooks/useWhenChanged';
import { entryCount } from '../services/entryIterator';
import { Button } from '@material-ui/core';

interface Props {
    streamId: string;
}

export default (props: Props) => {
    const store = useStore();
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
                action: <Button color="primary">
                    Show
                </Button>,
                autoHideDuration: 15000,
                key: 'articles-available',
                preventDuplicate: true,
            })
        }
    }, [!!updatePromise]);
    return <div>

    </div>
}