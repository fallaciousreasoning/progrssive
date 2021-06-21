import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { collect } from 'react-recollect';
import { BrowserRouter } from 'react-router-dom';
import AppBar from '../components/AppBar';
import LazySnackbarProvider from '../components/LazySnackbarProvider';
import RouteSwitcher from '../components/RouteSwitcher';
import { getStore } from '../hooks/store';
import { initStore } from '../services/store';
import { buildTheme } from '../styles/theme';
import { CollectProps } from '../types/RecollectStore';
import '../types/Window';
import WebWorker from '../worker';
import Head from 'next/head'
import { useSettings } from '../services/settings';

const useStyles = makeStyles(theme => ({
  page: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '800px',
    padding: theme.spacing(1),
  }
}));

// Make sure our store is initialized.
initStore();

const ProgrssiveApp = ({ Component, pageProps }: AppProps) => {
  const styles = useStyles({});
  const settings = useSettings();

  // Rerender when the external theme changes.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => {
    return buildTheme(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, prefersDark]);
  return <MuiThemeProvider theme={theme}>
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#4caf50" />
      <link rel="shortcut icon" href="/icon-green.png" />
      <link rel="manifest" href="/manifest.json" />
      <title>Progrssive Reader</title>
    </Head>
    <LazySnackbarProvider>
      <div>
        <AppBar>
          <div className={styles.page}>
            <Component {...pageProps} />
          </div>
        </AppBar>
      </div>
    </LazySnackbarProvider>
  </MuiThemeProvider>;
};

export default ProgrssiveApp;
