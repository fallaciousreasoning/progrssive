import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Layout from '../pages/_Layout';
import Routes from '../Routes';
import Centre from './Centre';

const pageLoadingIndicator = <Centre className="page-loader">
    <CircularProgress />
</Centre>

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 0 ? '100vw' : '-100vw'
    }),
    in: {
        x: 0
    },
    out: (direction: number) => ({
        x: direction > 0 ? '-100vw' : '100vw'
    })
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

const useStyles = makeStyles(theme => ({
    root: {
        height: `calc(100vh - 48px)`,
        width: '100vw',
        position: 'absolute',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    '@global': {
        'body': {
            background: `${theme.palette.background.default}`
        },
        '.page-loader': {
            marginTop: theme.spacing(1)
        }
    }
}));

export const SlidePage = (props: { direction?: number, children: any }) => {
    const styles = useStyles();

    return <motion.div
        className={styles.root}
        custom={props.direction || 1}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
        <Suspense fallback={pageLoadingIndicator}>
            {props.children}
        </Suspense>
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
        if (!route) {
            // Fallback to the streams page when no route matches.
            history.replace('/stream');
            return null;
        }

        return route;
    }, [location, history]);
    const direction = useMemo(() =>
        history.action === "POP"
            ? -1
            : 1,
        // This should only update when the path changes.
        // eslint-disable-next-line
        [location.pathname]);

    const Container = page && page.noLayout ? React.Fragment : Layout;

    return <AnimatePresence custom={direction} initial={false}>
        {page && <SlidePage key={page.prefix} direction={direction}>
            <Container>
                <page.component/>
            </Container>
        </SlidePage>}
    </AnimatePresence>;
}