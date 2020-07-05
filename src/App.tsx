import { makeStyles, MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React, { useMemo } from 'react';
import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import AppBar from './AppBar';
import { SnackbarHelper } from './components/SnackbarHelper';
import EntryViewer from './pages/EntryViewer';
import { useStore } from './hooks/store';
import SettingsPage from './pages/SettingsPage';
import StreamViewer from './pages/StreamViewer';
import { SubscriptionManager } from './pages/SubscriptionManager';
import { buildTheme } from './theme';
import _Layout from './pages/_Layout';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vw',
  }
}));

const AppRoute = (props: { path: string, children: React.ReactNode }) => {
  return <Route path={props.path}>
    <_Layout>
      {props.children}
    </_Layout>
  </Route>
}

export const App = (props) => {
  const styles = useStyles({});
  const store = useStore();

  const theme = useMemo(() => {
    return buildTheme(store.settings);
  }, [store.settings]);

  type RouteProps = RouteComponentProps<{ id: string }>;

  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <div className={styles.root}>
          <SnackbarHelper />
          <AppBar />
          <Switch>
            <AppRoute path="/subscriptions">
              <SubscriptionManager />
            </AppRoute>
            <AppRoute path="/settings">
              <SettingsPage />
            </AppRoute>
            <AppRoute path="/stream/:id?">
              <StreamViewer />
            </AppRoute>
            <AppRoute path="/entries/:id">
              <EntryViewer />
            </AppRoute>
          </Switch>
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  </BrowserRouter>;
};

export default App;
