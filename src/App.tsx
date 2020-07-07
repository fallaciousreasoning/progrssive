import { makeStyles, MuiThemeProvider, useMediaQuery } from '@material-ui/core';
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
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); 
  const theme = useMemo(() => {
    return buildTheme(store.settings, prefersDarkMode);
  }, [store.settings, prefersDarkMode]);

  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <div className={styles.root}>
          <SnackbarHelper />
          <AppBar />
          <RouteSwitcher/>
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;
