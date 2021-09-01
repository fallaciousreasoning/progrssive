import { useIsFrontend } from 'hooks/useIsFrontend';
import { getColorForTheme } from 'styles/colors';
import AppBar from 'components/AppBar';
import { useTheme } from 'hooks/responsive';
import { useOnIdle } from 'hooks/useIdle';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect, useRef } from 'react';
import Toasts from 'components/Toasts';
import { getSettings, updateCssVariables, useSettings } from 'services/settings';
import { initStore } from 'services/store';
import Animator from 'components/Animator';
import 'styles/article.css';
import 'styles/globals.css';
import 'styles/slider.css';
import 'styles/streamviewer.css';
import 'styles/toggle.css';
import 'types/Window';
import { cleanupWorker } from 'background';

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

    if (isFrontEnd) document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [settings, themeMode, isFrontEnd])

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
      <meta name="theme-color" content={getColorForTheme(settings.accent, themeMode)} />
      <link rel="shortcut icon" href="/icon-green.png" />
      <link rel="manifest" href="/manifest.json" />
      <title>Progrssive Reader</title>
    </Head>
    <Toasts />
    <AppBar>
      <div className="mx-auto p-2 max-w-3xl">
        <Animator duration={200}>
          <Component key={globalThis.location?.pathname} {...pageProps} />
        </Animator>
      </div>
    </AppBar>
  </>;
};

export default ProgrssiveApp;