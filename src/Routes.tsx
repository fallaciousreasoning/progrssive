import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import EntryViewer from './pages/EntryViewer';
import SettingsPage from './pages/SettingsPage';
import StreamViewer from './pages/StreamViewer';
import { SubscriptionManager } from './pages/SubscriptionManager';
import Layout from './pages/_Layout';

type Props = RouteProps & React.HTMLProps<HTMLDivElement>;

interface AppRoute {
    prefix: string;
    render: (id: string) => React.ReactNode
}

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
        render: () => <SubscriptionManager />
    },
    {
        prefix: "/settings",
        render: () => <SettingsPage />
    },
    {
        prefix: '/stream',
        render: (id) => <StreamViewer id={id}/>
    },
    {
        prefix: '/entries',
        render: (id) => <EntryViewer id={id}/>
    }
] as AppRoute[];