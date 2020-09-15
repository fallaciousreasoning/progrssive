import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppBar from './components/AppBar';
import LazySnackbarProvider from './components/LazySnackbarProvider';
import RouteSwitcher from './components/RouteSwitcher';
import { useStore } from './hooks/store';
import { buildTheme } from './theme';
import WebWorker from './worker';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vw',
  }
}));

export const App = (props) => {
  const styles = useStyles({});
  const store = useStore();

  // Rerender when the external theme changes.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => {
    return buildTheme(store.settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.settings, prefersDark]);

  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <LazySnackbarProvider>
        <div className={styles.root}>
          <AppBar>
            <RouteSwitcher />
          </AppBar>
        </div>
      </LazySnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;

const worker = new WebWorker();
worker.runEntryCleanup();
