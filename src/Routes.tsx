import React from 'react';
import { SubscriptionManager } from './pages/SubscriptionManager';
import SettingsPage from './pages/SettingsPage';
import StreamViewer from './pages/StreamViewer';
import EntryViewer from './pages/EntryViewer';
import Layout from './pages/_Layout';
import { Route, Switch, Redirect, RouteProps } from 'react-router-dom';
import { motion } from 'framer-motion';

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