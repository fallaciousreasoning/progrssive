import React, { useCallback } from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import opmlToJson from 'opml-to-json';
import { pickFile, getFileText } from '../utils/files';

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
    return new Promise((accept, reject) => {
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

export default (props: Props & ButtonProps) => {
    const pick = useCallback(async () => {
        const file = await pickFile();
        const text = await getFileText(file);
        const opml = await parseOpml(text);
    }, []);

    return <Button
        variant="outlined"
        color="primary"
        {...props}
        onClick={pick}>
        Import Opml
    </Button>
}