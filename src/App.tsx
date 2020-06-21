import { makeStyles, MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React, { useMemo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppBar from './AppBar';
import { SnackbarHelper } from './components/SnackbarHelper';
import EntryViewer from './EntryViewer';
import { useStore } from './hooks/store';
import RouteManager, { AppRoute } from './RouteManager';
import SettingsPage from './SettingsPage';
import StreamViewer from './StreamViewer';
import { SubscriptionManager } from './SubscriptionManager';
import { buildTheme } from './theme';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vw',
  }
}));

const routes: AppRoute[] = [
  {
    prefix: '/stream/',
    render: (id, active) => <StreamViewer id={id} active={active} />
  },
  {
    prefix: '/entries/',
    render: (id, active) => <EntryViewer id={id} active={active} />
  }
];

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
          <Switch>
            <Route path="/subscriptions">
              <SubscriptionManager />
            </Route>
            <Route path="/settings">
              <SettingsPage />
            </Route>
            <RouteManager routes={routes} />
          </Switch>
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;
