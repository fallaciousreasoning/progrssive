import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/icons/Menu';
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