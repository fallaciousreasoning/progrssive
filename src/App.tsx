import { makeStyles, MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppBar from './AppBar';
import RouteSwitcher from './components/RouteSwitcher';
import { SnackbarHelper } from './components/SnackbarHelper';
import { useStore } from './hooks/store';
import { buildTheme } from './theme';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vw',
  }
}));

export const App = (props) => {
  const styles = useStyles({});
  const store = useStore();

  const theme = useMemo(() => {
    return buildTheme(store.settings);
  }, [store.settings]);

  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <div className={styles.root}>
          <SnackbarHelper />
          <AppBar />
          <RouteSwitcher/>
          {/* <Routes/> */}
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;
