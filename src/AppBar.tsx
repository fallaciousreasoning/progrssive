import React, { useState, useEffect } from 'react';
import { Toolbar, AppBar, IconButton, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import AppDrawer from './AppDrawer';
import { makeStyles } from '@material-ui/styles';

export const AppBarContext: React.Context<React.Ref<any>> = React.createContext(undefined);

const useStyles = makeStyles({
    pageActions: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row-reverse',
        width: '100%'
    }
})

export default (props) => {
    const styles = useStyles();

    return <AppBar position="static" color="primary">
            <Toolbar variant="dense">
                <AppDrawer trigger={
                    <IconButton>
                        <Menu />
                    </IconButton>} />
                <Typography>Progrssive</Typography>
                <div className={styles.pageActions} id="app-bar-button-container">

                </div>
            </Toolbar>
        </AppBar>;
}