import { useIsFrontend } from '@/hooks/useIsFrontend';
import AppBar from 'components/AppBar';
import LazySnackbarProvider from 'components/LazySnackbarProvider';
import { useTheme } from 'hooks/responsive';
import { useOnIdle } from 'hooks/useIdle';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { getSettings, updateCssVariables, useSettings } from 'services/settings';
import { initStore } from 'services/store';
import 'styles/article.css';
import 'styles/globals.css';
import 'styles/slider.css';
import 'styles/streamviewer.css';
import 'styles/toggle.css';
import 'types/Window';
import { cleanupWorker } from 'worker';

// Make sure our store is initialized.
initStore();

const ProgrssiveApp = ({ Component, pageProps }: AppProps) => {
  const settings = useSettings();
  const themeMode = useTheme();

  // Note: We don't know the theme class to apply until we're on the client, so
  // we do this to not break SSR.
  const isFrontEnd = useIsFrontend();
  useEffect(() => {
    updateCssVariables(settings);

    if (isFrontEnd) document.body.classList.toggle('dark', themeMode === 'dark');
  }, [settings, themeMode])

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
    <LazySnackbarProvider>
      <AppBar>
        <div className="mx-auto p-2 max-w-3xl">
          <Component {...pageProps} />
        </div>
      </AppBar>
    </LazySnackbarProvider>
  </>;
};

export default ProgrssiveApp;