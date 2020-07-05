import React from 'react';
import { SubscriptionManager } from './pages/SubscriptionManager';
import SettingsPage from './pages/SettingsPage';
import StreamViewer from './pages/StreamViewer';
import EntryViewer from './pages/EntryViewer';
import Layout from './pages/_Layout';
import { Route, Switch, Redirect, RouteProps } from 'react-router-dom';

type Props = RouteProps & React.HTMLProps<HTMLDivElement>;

const AppRoute = (props: Props) => {
    const { path, component, render, location, ...rest} = props;
    return <Route path={path} component={component} render={render} location={location}>
        <Layout {...rest}>
            {props.children}
        </Layout>
    </Route>
}
export default [
    <AppRoute path="/subscriptions">
        <SubscriptionManager />
    </AppRoute>,
    <AppRoute path="/settings">
        <SettingsPage />
    </AppRoute>,
    <AppRoute path="/stream/:id?">
        <StreamViewer />
    </AppRoute>,
    <AppRoute path="/entries/:id+">
        <EntryViewer />
    </AppRoute>,
    <Redirect to="/stream" push={false}/>
];