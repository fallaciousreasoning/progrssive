import React from 'react';
import { SubscriptionManager } from './pages/SubscriptionManager';
import SettingsPage from './pages/SettingsPage';
import StreamViewer from './pages/StreamViewer';
import EntryViewer from './pages/EntryViewer';
import Layout from './pages/_Layout';
import { Route, Switch, Redirect } from 'react-router-dom';

const AppRoute = (props: { path: string, children: React.ReactNode }) => {
    return <Route path={props.path}>
        <Layout>
            {props.children}
        </Layout>
    </Route>
}
export default () => {
    return <Switch>
        <AppRoute path="/subscriptions">
            <SubscriptionManager />
        </AppRoute>
        <AppRoute path="/settings">
            <SettingsPage />
        </AppRoute>
        <AppRoute path="/stream/:id?">
            <StreamViewer />
        </AppRoute>
        <AppRoute path="/entries/:id+">
            <EntryViewer />
        </AppRoute>
        <Redirect to="/stream"/>
    </Switch>
}