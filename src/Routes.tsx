import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import StreamViewer from './pages/StreamViewer';
import Layout from './pages/_Layout';

type Props = RouteProps & React.HTMLProps<HTMLDivElement>;

interface AppRoute {
    prefix: string;
    render: (id: string, location: Location) => React.ReactNode
}

const SubscriptionManager = React.lazy(() => import('./pages/SubscriptionManager'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const entryViewerPromise = import('./pages/EntryViewer');
const EntryViewer = React.lazy(() => entryViewerPromise);
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

export const useIsActive = (pagePath: string) => {
    const actualLocation = useLocation();
    return actualLocation.pathname === pagePath;
}

export default [
    {
        prefix: '/subscriptions',
        render: () => <SubscriptionManager/>
    },
    {
        prefix: "/settings",
        render: () => <SettingsPage />
    },
    {
        prefix: "/about",
        render: () => <AboutPage/>
    },
    {
        prefix: '/stream',
        render: (id, location) => <StreamViewer id={id} location={location} active/>
    },
    {
        prefix: '/entries',
        render: (id, location) => <EntryViewer id={id} active/>
    },
    {
        prefix: '/clean',
        render: () => <CleanStorage/>
    }
] as AppRoute[];