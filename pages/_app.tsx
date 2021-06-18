import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { collect } from 'react-recollect';
import { BrowserRouter } from 'react-router-dom';
import { defaultSettings } from '../actions/settings';
import AppBar from '../components/AppBar';
import LazySnackbarProvider from '../components/LazySnackbarProvider';
import RouteSwitcher from '../components/RouteSwitcher';
import { getStore } from '../hooks/store';
import { initStore } from '../services/store';
import { buildTheme } from '../styles/theme';
import { CollectProps } from '../types/RecollectStore';
import '../types/Window';
import WebWorker from '../worker';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vw',
  }
}));

const ProgrssiveApp = collect(({ Component, pageProps, store }: AppProps & CollectProps) => {
  const styles = useStyles({});

  // Rerender when the external theme changes.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => {
    return buildTheme(store.settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.settings, prefersDark]);
  return <MuiThemeProvider theme={theme}>
    <LazySnackbarProvider>
      <div className={styles.root}>
        <AppBar>
          <Component {...pageProps} />
        </AppBar>
      </div>
    </LazySnackbarProvider>
  </MuiThemeProvider>;
});

export default ProgrssiveApp;
