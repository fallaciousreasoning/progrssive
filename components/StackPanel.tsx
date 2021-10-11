import { Size } from '@/styles/sizes';
import { AnimatePresence, motion, Transition, Variant } from 'framer-motion';
import React from 'react';

// Configures Tailwind flex. Note: They're listed here so tailwind includes them.
// flex-row flex-row-reverse flex-col flex-col-reverse items-end items-start items-center items-stretch justify-start justify-end justify-stretch
interface Props {
    direction?: 'row'
    | 'row-reverse'
    | 'col'
    | 'col-reverse';
    alignItems?: 'start' | 'end' | 'center' | 'stretch';
    justifyContent?: 'start' | 'end' | 'center' | 'stretch';

    spacing?: `space-x-${number}` | `space-y-${number}`;
    animatePresence?: boolean;

    variants?: {
        initial?: Variant;
        in?: Variant;
        out?: Variant;
    },

    transition?: Transition;
}

const childVariants = {
    initial: {
        opacity: 0,
        scale: 0
    },
    in: {
        opacity: 1,
        scale: 1
    },
    out: {
        opacity: 0,
        scale: 0
    }
};

const childTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.2
};

const StackPanel = (props: Props & React.HTMLProps<HTMLDivElement>) => {
    let {
        animatePresence,
        direction,
        spacing,
        alignItems,
        justifyContent,
        variants,
        transition,
        ...rest
    } = props;
    direction = direction || 'col';
    spacing = props.spacing ?? (direction.includes('col') ? 'space-y-1' : 'space-x-1');
    alignItems = alignItems || 'stretch';
    justifyContent = justifyContent || 'start';

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];

    const Container = animatePresence ? AnimatePresence : React.Fragment;

    return <div {...rest} className={`
        flex flex-${direction} items-${alignItems} justify-${justifyContent}
        w-full h-full
        ${props.className}
        ${spacing}`}>
        <Container>
            {/* Filter out null children, to make adding/removing more intuitive */}
            {children.filter(c => !!c).map((c, i) => <motion.div key={c['key'] || c['id'] || i}
                initial="initial"
                animate="in"
                exit="out"
                variants={props.variants || childVariants}
                transition={transition || childTransition}>
                {c}
            </motion.div>)}
        </Container>
    </div>
};

export default StackPanel;