import React, { useCallback } from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import opmlToJson from 'opml-to-json';
import { pickFile } from '../utils/files';

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
        const files = await pickFile();
        console.log(files);
    }, []);

    return <Button
        variant="outlined"
        color="primary"
        {...props}
        onClick={pick}>
        Import Opml
    </Button>
}