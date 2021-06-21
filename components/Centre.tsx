import { makeStyles } from "@material-ui/core";
import * as React from 'react';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center'
    }
});

export default function Centre(props: { children: React.ReactNode, className?: string }) {
    const styles = useStyles();

    return <div className={`${props.className} ${styles.root}`}>
        {props.children}
    </div>
}