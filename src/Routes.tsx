import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import StreamViewer from './pages/StreamViewer';
import Layout from './pages/_Layout';
import CompactPage from './pages/CompactPage';

type Props = RouteProps & React.HTMLProps<HTMLDivElement>;

interface AppRoute {
    prefix: string;
    component: React.SFC<{}>
}

const SubscriptionManager = React.lazy(() => import('./pages/SubscriptionManager'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const CleanStorage = React.lazy(() => import('./pages/CleanStorage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

const AppRoute = (props: Props) => {
    const { path, component, render, location, ...rest } = props;
    return <Route path={path} render={render} location={location}>

        <Layout {...rest}>
            {props.children}
        </Layout>
    </Route >
}

export default [
    {
        prefix: '/subscriptions',
        component: SubscriptionManager
    },
    {
        prefix: "/settings",
        component: SettingsPage
    },
    {
        prefix: "/about",
        component: AboutPage
    },
    {
        prefix: '/stream',
        component: CompactPage
    },
    {
        prefix: '/clean',
        component: CleanStorage
    }
] as AppRoute[];