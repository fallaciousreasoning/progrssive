import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from 'components/AppBar';
import LazySnackbarProvider from 'components/LazySnackbarProvider';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { useSettings, getSettings } from 'services/settings';
import { initStore } from 'services/store';
import { buildTheme } from 'styles/theme';
import 'types/Window';
import 'styles/globals.css';
// import WebWorker from 'worker';

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

// const idlePolyFill = (callback: () => void) => setTimeout(callback, 5000);
// (async () => {
//   const onIdle = window.requestIdleCallback || idlePolyFill;

//   // Wait until we're idle before running cleanup.
//   onIdle(async () => {
//     const worker = new WebWorker();
//     const settings = await getSettings();
//     // Clone cleanup settings to pass to worker.
//     const cleanupSettings = JSON.parse(JSON.stringify(settings.cleanupSettings));
//     worker.runEntryCleanup(cleanupSettings);
//   })
// })();
