import Button, { ButtonProps } from '@material-ui/core/Button';
import React, { useCallback } from 'react';
import { getStore } from '../hooks/store';
import { guessFeedUrl } from '../model/subscription';
import { downloadTextFile } from '../utils/files';

export const getSubscriptionsOpml = async () => {
    const outlines = getStore().subscriptions.map(s => ({
        title: s.title,
        type: 'rss',
        xmlUrl: guessFeedUrl(s),
        htmlUrl: s.website
    }));

    const opmlGenerator = (await import("opml-generator")).default;
    const opml = opmlGenerator({ title: 'Progrssive Feed Dump', dateCreated: new Date() }, outlines);
    return opml;
}

export default (props: ButtonProps) => {
    const download = useCallback(async () => {
        const opml = getSubscriptionsOpml();
        downloadTextFile(await opml,
            `progrssive-feeds-${new Date().toISOString()}.opml`,
            'text/xml');
    }, []);
    return <Button variant="outlined" color="primary" {...props} onClick={download}>
        Export Feeds
    </Button>
}