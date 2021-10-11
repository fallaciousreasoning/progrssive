import * as React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
}

const StickyHeader = (props: Props) => {
    const { children, className, ...rest } = props;

    return <div className={`${className} sticky top-0`} {...rest}>
        {children}
    </div>;
};

export default StickyHeader;