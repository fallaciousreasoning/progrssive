import { Component, useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { EmojiPeople } from "@material-ui/icons";
import React from 'react';

interface Props {
    message: string;
    children?: React.ReactNode;
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    message: {
    },
    icon: {
        flex: 1,
        width: '90%'
    },
    children: {
    }
});

export default (props: Props & React.HTMLProps<HTMLDivElement>) => {
    const styles = useStyles();
    return <div className={styles.root} {...props}>
        <div className={styles.message}>
            <Typography>
                {props.message}
            </Typography>
        </div>
        {props.children && <div className={styles.children}>
            {props.children}
        </div>}
        <EmojiPeople className={styles.icon} />
    </div>
}