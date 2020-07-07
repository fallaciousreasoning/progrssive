import { makeStyles } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Layout from '../pages/_Layout';
import Routes from '../Routes';

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
        if (!route) {
            // Fallback to the streams page when no route matches.
            history.replace('/stream');
            return null;
        }

        const id = location.pathname
            .substr(route.prefix.length + 1);

        return route.render(id, location as any);
    }, [location, history]);
    const direction = useMemo(() =>
        history.action === "POP"
            ? -1
            : 1,
        // This should only update when the path changes.
        // eslint-disable-next-line
        [location.pathname]);

    return <AnimatePresence custom={direction} initial={false}>
        <SlidePage key={location.pathname} direction={direction}>
            <Layout>
                {page}
            </Layout>
        </SlidePage>
    </AnimatePresence>;
}