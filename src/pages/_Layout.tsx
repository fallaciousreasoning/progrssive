import { makeStyles } from "@material-ui/core";
import React from 'react';
interface Props {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '800px',
        height: '100%',
        padding: theme.spacing(1),
    }
}))

export default (props: Props & React.HTMLProps<HTMLDivElement>) => {
    const styles = useStyles();

    return <div className={styles.root}>
        {props.children}
    </div>;
}