import { Collapse, List, ListItem } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({
    nested: {
        paddingLeft: '30px !important',
        
    }
}));

interface Props {
    defaultOpen?: boolean;
    children?: any;// ListItem[] | ListItem;
    header: any;//ListItem;
}

export default (props: Props) => {
    const styles = useStyles();
    const [open, setOpen] = useState(props.defaultOpen);
    console.log(props.children)

    return <>
        {React.cloneElement(props.header, { onClick: () => setOpen(!open) })}
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List disablePadding className={styles.nested}>
                {props.children.map((c, i) => React.cloneElement(c, { key: i, className: styles.nested }))}
            </List>
        </Collapse>
    </>;
}