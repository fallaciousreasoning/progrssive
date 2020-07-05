import { makeStyles } from "@material-ui/core"
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '100%',
        overflowY: 'auto'
    }
}))

export default (props: Props) => {
    const styles = useStyles();

    return <div className={styles.root}>
        {props.children}
    </div>;
}