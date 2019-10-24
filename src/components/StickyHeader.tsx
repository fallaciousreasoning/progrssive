import { makeStyles } from "@material-ui/styles";
import * as React from 'react';

const useStyles = makeStyles({
    stickyHeader: {
        position: 'sticky',
        top: 0
    }
});

interface Props extends React.HTMLProps<HTMLDivElement> {
}

export default (props: Props) => {
    const styles = useStyles();
    const { children, className, ...rest } = props;

    return <div className={`${className} ${styles.stickyHeader}`} {...rest}>
        {children}
    </div>;
}