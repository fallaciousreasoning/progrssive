import { Collapse, List, makeStyles } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';

const useStyles = makeStyles(({
    "@global": {
        ".nested-list *": {
            paddingLeft: '40px'
        }
    }
}));

interface Props {
    defaultOpen?: boolean;
    children?: React.ReactNode[] | React.ReactNode;
    header: (props: { open: boolean, toggle: () => void }) => JSX.Element;
}

export default (props: Props) => {
    useStyles();

    const [open, setOpen] = useState(props.defaultOpen);
    return <>
        {props.header({ open, toggle: () => setOpen(!open) })}
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List disablePadding className="nested-list">
                {props.children}
            </List>
        </Collapse>
    </>;
}