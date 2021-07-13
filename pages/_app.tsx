import { CssBaseline } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { useMediaQuery } from '../hooks/responsive';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useMemo } from 'react';
import 'styles/globals.css';
import AppBar from '../components/AppBar';
import LazySnackbarProvider from '../components/LazySnackbarProvider';
import { useOnIdle } from '../hooks/useIdle';
import { getSettings, useSettings } from '../services/settings';
import { initStore } from '../services/store';
import { buildTheme } from '../styles/theme';
import '../types/Window';
import { cleanupWorker } from '../worker';

// Make sure our store is initialized.
initStore();

const ProgrssiveApp = ({ Component, pageProps }: AppProps) => {
  const settings = useSettings();

  // Rerender when the external theme changes.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => {
    return buildTheme(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, prefersDark]);

  useOnIdle(async () => {
    const { cleanupSettings } = await getSettings();
    cleanupWorker().runEntryCleanup(cleanupSettings);
  });
  return <>
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
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <LazySnackbarProvider>
          <AppBar>
            <div className="mx-auto p-2 max-w-3xl">
              <Component {...pageProps} />
            </div>
          </AppBar>
        </LazySnackbarProvider>
      </div>
    </MuiThemeProvider>
  </>;
};

export default ProgrssiveApp;