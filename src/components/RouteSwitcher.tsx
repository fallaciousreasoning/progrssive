import React, { useState, useMemo } from 'react';
import { Route, Switch, Link, useLocation, useHistory } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import StreamViewer from '../pages/StreamViewer';
import Routes from '../Routes';
import _Layout from '../pages/_Layout';
import EntryViewer from '../pages/EntryViewer';
import { makeStyles } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';

const duration = 0.3;

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 1 ? '100vw' : '-100vw'
    }),
    in: {
        x: 0
    },
    out: (direction: number) => ({
        x: direction > 1 ? '-100vw' : '100vw'
    }),
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1
};
const pageStyle = {
    position: "absolute",
    width: '100vw',
    height: 'calc(100vh - 48px)',
    overflowY: 'auto',
};

export const SlidePage = (props: { direction?: number, children: any }) => {
    return <motion.div
        style={pageStyle as any}
        custom={props.direction || 1}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
        {props.children}
    </motion.div>
}

export default (props) => {
    const location = useLocation();
    const history = useHistory();
    const page = useMemo(() => {
        // Find a matching route. React-Router doesn't really work for this :/
        const route = Routes.filter(r => location.pathname.startsWith(r.prefix)
            && (location.pathname[r.prefix.length] === "/"
                || location.pathname.length === r.prefix.length))[0];
        if (!route)
            return null;

        const id = location.pathname
            .substr(route.prefix.length);

        return route.render(id);
    }, [location.pathname]);
    const direction = useMemo(() =>
        history.action === "POP"
            ? -1
            : 1,
        [location.pathname]);

    return <AnimatePresence custom={direction}>
        <SlidePage key={location.pathname} direction={direction}>
            {page}
        </SlidePage>
    </AnimatePresence>;
}