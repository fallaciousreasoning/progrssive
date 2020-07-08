import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import StreamViewer from './pages/StreamViewer';
import Layout from './pages/_Layout';

type Props = RouteProps & React.HTMLProps<HTMLDivElement>;

interface AppRoute {
    prefix: string;
    render: (id: string, location: Location) => React.ReactNode
}

const SubscriptionManager = React.lazy(() => import('./pages/SubscriptionManager'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const EntryViewer = React.lazy(() => import('./pages/EntryViewer'));

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
        render: () => <SubscriptionManager/>
    },
    {
        prefix: "/settings",
        render: () => <SettingsPage />
    },
    {
        prefix: '/stream',
        render: (id, location) => <StreamViewer id={id} location={location}/>
    },
    {
        prefix: '/entries',
        render: (id) => <EntryViewer id={id}/>
    }
] as AppRoute[];