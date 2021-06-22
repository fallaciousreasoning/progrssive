import Button, { ButtonProps } from '@material-ui/core/Button';
import React, { useCallback } from 'react';
import { getFileText, pickFile } from '../utils/files';
import { Subscription, feedUrlPrefix } from '../model/subscription';

interface OpmlNode {
    text: string;
    title: string;
    htmlurl: string;
    folder: string;
    xmlurl: string;
    type: string;
    children?: OpmlNode[];
}
interface Props {
     onOpmlLoaded: (feeds: Subscription[]) => void;
}

export const parseOpml = (opml: string): Promise<OpmlNode[]> => {
    const onlyFeeds = (root: OpmlNode, nodes: OpmlNode[] = []): OpmlNode[] => {
        if (root.xmlurl){
            nodes.push(root);
        }

        if (root.children) {
            for (const child of root.children)
                onlyFeeds(child, nodes);
        }

        return nodes;
    }
    return new Promise(async (accept, reject) => {
        const opmlToJson = (await import("opml-to-json")).default;
        opmlToJson(opml, (error, json) => {
            if (error) {
                reject(error);
            } else {
                // Flatten the structure.
                const feeds = onlyFeeds(json);
                accept(feeds);
            }
        })
    });
}

const ImportOpml = (props: Props & ButtonProps) => {
    const { onOpmlLoaded, ...buttonProps } = props;

    const pick = useCallback(async () => {
        const file = await pickFile();
        const text = await getFileText(file);
        const opml = await parseOpml(text);
        
        // Map the opml nodes to subscriptions.
        const subscriptions: Subscription[] = opml.map(o => ({
            id: `${feedUrlPrefix}${o.xmlurl}`,
            feedUrl: o.xmlurl,
            title: o.title,
            categories: [{
                id: o.folder,
                label: o.folder
            }].filter(c => !!c.id),
            website: o.htmlurl
        }));
        onOpmlLoaded(subscriptions);
    }, [onOpmlLoaded]);

    return <Button
        variant="outlined"
        color="primary"
        {...buttonProps}
        onClick={pick}>
        Import Opml
    </Button>
};

export default ImportOpml;