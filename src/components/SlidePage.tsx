import { motion, AnimatePresence } from "framer-motion";
import { makeStyles, CircularProgress } from "@material-ui/core";
import { Suspense, useMemo } from "react";
import Centre from "./Centre";
import React from 'react'
import { useHistory } from "react-router-dom";

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
    duration: 0.2
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

const pageLoadingIndicator = <Centre className="page-loader">
    <CircularProgress />
</Centre>

export default (props: {
    className?: string,
    children: React.ReactNode | undefined,
    initial?: boolean
}) => {
    const styles = useStyles();
    const history = useHistory();

    const direction = useMemo(() =>
        history.action === "POP"
            ? -1
            : 1,
        // This should only update when the path changes.
        // eslint-disable-next-line
        [location.pathname]);

    const children = (Array.isArray(props.children)
        ? props.children
        : [props.children]).filter(c => c);

    return <AnimatePresence custom={direction} initial={!!props.initial}>
        {children.map((child, index) => <motion.div
            className={props.className || styles.root}
            custom={direction || 1}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            key={child['key'] || child['id'] || index}
            transition={pageTransition}
        >
            <Suspense fallback={pageLoadingIndicator}>
                {child}
            </Suspense>
        </motion.div>)}

    </AnimatePresence>
}