import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React from 'react';
import AppDrawer from './AppDrawer';
import StackPanel from './components/StackPanel';

export const AppBarContext: React.Context<React.Ref<any>> = React.createContext(undefined);

const useStyles = makeStyles(theme => ({
    pageActions: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row-reverse' as any,
        width: '100%'
    }
}))

export default (props) => {
    const styles = useStyles();

    return <AppBar position="static" color="primary">
        <Toolbar variant="dense">
            <AppDrawer trigger={
                <IconButton>
                    <Menu />
                </IconButton>} />
            <Typography color="textPrimary">Progrssive</Typography>
            <StackPanel direction="row-reverse"
                className={styles.pageActions}
                id="app-bar-button-container">

            </StackPanel>
        </Toolbar>
    </AppBar>;
}