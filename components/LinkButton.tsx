import Button, { ButtonProps } from 'components/Button';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

const LinkButton = (props: ButtonProps & { href: string, replace?: boolean }) => {
    const router = useRouter();
    const { href, replace, onClick } = props;
    const onButtonClick = useCallback((e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey || e.button === 3)
            return;

        e.preventDefault();

        if (!replace)
            router.push(href);
        else router.replace(href);

        if (onClick)
            onClick(e as any);
    }, [href, replace, router, onClick]);

    return <Button {...props} onClick={onButtonClick} />
};

export default LinkButton;