import { makeStyles } from "@material-ui/core"
import React, { useRef, useState, useEffect } from 'react';

interface Props {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: (props: { top: number }) =>
            `calc(100vh - ${props.top}px)`,
        overflowY: 'auto'
    }
}))

export default (props: Props) => {
    const rootRef = useRef<HTMLDivElement>();
    const styles = useStyles({
        top: rootRef.current
            ? rootRef.current.getBoundingClientRect().top
            : 0
    });

    return <div ref={rootRef} className={styles.root}>
        {props.children}
    </div>;
}