import React, { useCallback, useState, useMemo } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { getStore, useStore } from '../hooks/store';
import * as opmlGenerator from 'opml-generator';
import { Subscription } from '../model/subscription';

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
        const a = document.createElement('a');
        const href = `data:text/xml;charset=utf-8,${encodeURIComponent(opml)}`;
        a.setAttribute('href', href);
        a.setAttribute('download', `progrssive-feeds-${new Date().toISOString()}.xml`);
        
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, []);
    return <Button variant="outlined" color="primary" {...props} onClick={download}>
        Export Feeds
    </Button>
}