import React from 'react'
import { makeStyles } from '@material-ui/core'
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    direction?: 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse';
    children?: React.ReactNode | React.ReactNode[];
    spacing?: number;
    animatePresence?: boolean;
}

const childVariants = {
    initial: {
        opacity: 0
    },
    in: {
        opacity: 1
    },
    out: {
        opacity: 0
    }
};

const childTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: (props: Props) =>
            props.direction || 'column',
        '&> div + div': {
            marginLeft: (props: Props) => theme.spacing(props.spacing)
        }
    }
}));

export default (props: Props) => {
    const spacing = props.spacing === undefined
        ? 1
        : props.spacing;
    const styles = useStyles({ ...props, spacing });

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];

    return <div className={styles.root}>
        <AnimatePresence>
            {/* Filter out null children, to make adding/removing more intuitive */}
            {children.filter(c => !!c).map((c, i) => <motion.div key={i}
                initial="initial"
                animate="in"
                exit="out"
                variants={childVariants}
                transition={childTransition}>
                {c}
            </motion.div>)}
        </AnimatePresence>
    </div>
}