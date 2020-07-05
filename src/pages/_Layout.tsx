import { makeStyles } from "@material-ui/core"
import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    page: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '800px',
        height: '100%',
    }
}))

export default (props: Props & React.HTMLProps<HTMLDivElement>) => {
    const rootRef = useRef<HTMLDivElement>();
    const styles = useStyles({
        top: rootRef.current
            ? rootRef.current.getBoundingClientRect().top
            : 0
    });

    return <div ref={rootRef} className={`page`}>
        <div className={styles.page}>
            {props.children}
        </div>
    </div>;
}