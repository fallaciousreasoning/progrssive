import { Button, ButtonProps } from '@material-ui/core';
import * as opmlGenerator from 'opml-generator';
import React, { useCallback } from 'react';
import { getStore } from '../hooks/store';
import { Subscription } from '../model/subscription';
import { downloadTextFile } from '../utils/files';

export const getSubscriptionsOpml = () => {
    const prefix = "feed/";
    const guessFeedUrl = (s: Subscription) => s.id.substr(prefix.length);
    const outlines = getStore().subscriptions.map(s => ({
        title: s.title,
        type: 'rss',
        xmlUrl: guessFeedUrl(s),
        htmlUrl: s.website
    }));
    const opml = opmlGenerator({ title: 'Progrssive Feed Dump', dateCreated: new Date() }, outlines);
    return opml;
}

export default (props: ButtonProps) => {
    const download = useCallback(() => {
        const opml = getSubscriptionsOpml();
        downloadTextFile(opml,
            `progrssive-feeds-${new Date().toISOString()}.opml`,
            'text/xml');
    }, []);
    return <Button variant="outlined" color="primary" {...props} onClick={download}>
        Export Feeds
    </Button>
}