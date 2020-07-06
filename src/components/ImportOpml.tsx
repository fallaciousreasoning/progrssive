import React from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import opmlToJson from 'opml-to-json';

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
    return <Button
        variant="outlined"
        color="primary"
        {...props}>
        Import Opml
    </Button>
}