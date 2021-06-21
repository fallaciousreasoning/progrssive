import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { collect } from 'react-recollect';
import { BrowserRouter } from 'react-router-dom';
import AppBar from '../components/AppBar';
import LazySnackbarProvider from '../components/LazySnackbarProvider';
import RouteSwitcher from '../components/RouteSwitcher';
import { getStore } from '../hooks/store';
import { getDb } from '../services/db';
import { getSettings, useSettings } from '../services/settings';
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

export const App = collect(({ store }: CollectProps) => {
  const styles = useStyles({});

  // Rerender when the external theme changes.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const settings = useSettings();

  const theme = useMemo(() => {
    return buildTheme(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, prefersDark]);

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
});

export default App;

const idlePolyFill = (callback: () => void) => setTimeout(callback, 5000);
(async () => {
  const onIdle = window.requestIdleCallback || idlePolyFill;

  // Wait until we're idle before running cleanup.
  onIdle(async () => {
    const worker = new WebWorker();
    const settings = await getSettings();
    // Clone cleanup settings to pass to worker.
    const cleanupSettings = JSON.parse(JSON.stringify(settings.cleanupSettings));
    worker.runEntryCleanup(cleanupSettings);
  })
})();

