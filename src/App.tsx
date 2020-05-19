import { MuiThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppBar from './AppBar';
import { SnackbarHelper } from './components/SnackbarHelper';
import EntryViewer from './EntryViewer';
import { useStore } from './hooks/store';
import RouteManager, { AppRoute } from './RouteManager';
import SettingsPage from './SettingsPage';
import StreamViewer from './StreamViewer';
import { buildTheme } from './theme';
import { SubscriptionManager } from './SubscriptionManager'

const useStyles = makeStyles(theme => {
  return {
    root: {
      width: '100vw',
      height: '100vw',
    }
  }
});

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
  }, [store.settings.fontSize]);

  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <SnackbarHelper />
        <div className={styles.root}>
          <AppBar />
          <Switch>
            <Route path="/subscriptions">
              <SubscriptionManager />
            </Route>
            <Route path="/settings">
              <SettingsPage/>
            </Route>
            <RouteManager routes={routes} />
          </Switch>
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;
