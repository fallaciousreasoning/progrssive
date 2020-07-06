import React, { useCallback } from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import opmlToJson from 'opml-to-json';
import { pickFile, getFileText } from '../utils/files';

interface Props {

}

export const parseOpml = (opml: string) => {
    return new Promise((accept, reject) => {
        opmlToJson(opml, (error, json) => {
            if (error) {
                reject(error);
            } else {
                accept(json);
            }
        })
    });
}

export default (props: Props & ButtonProps) => {
    const pick = useCallback(async () => {
        const file = await pickFile();
        const text = await getFileText(file);
        console.log(text);
    }, []);

    return <Button
        variant="outlined"
        color="primary"
        {...props}
        onClick={pick}>
        Import Opml
    </Button>
}