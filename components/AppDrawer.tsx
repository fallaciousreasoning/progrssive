import { useIsFrontend } from '@/hooks/useIsFrontend';
import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import useInstallPrompt from '../hooks/useInstallPrompt';
import About from '../icons/about.svg';
import Articles from '../icons/articles.svg';
import Install from '../icons/install.svg';
import Settings from '../icons/settings.svg';
import Subscriptions from '../icons/subscriptions.svg';
import ListItemButton from './ListItemButton';

function Drawer(props: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    const isFrontEnd = useIsFrontend();
    if (!isFrontEnd) return null;

    return ReactDOM.createPortal(<>
        {props.isOpen && <div className="fixed top-0 bottom-0 left-0 right-0 opacity-30 bg-foreground z-10" onClick={props.onClose} />}
        <div className={`fixed z-20 top-0 bottom-0 left-0 bg-background transform transition-transform ${props.isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {props.children}
        </div>
    </>, document.body);
}

const iconProps = { className: "opacity-50", width: 24, height: 24 };
export default function AppDrawer(props: { trigger: JSX.Element }) {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => {
        setOpen(false)
    }, []);

    const triggerProps = useMemo(() => ({
        onClick: () => setOpen(true)
    }), []);

    const installPrompt = useInstallPrompt();

    return <div>
        {React.cloneElement(props.trigger, triggerProps)}
        <Drawer isOpen={open} onClose={close}>
            <div className="m-2 w-64">
                <h5 className="text-xl ml-2">
                    Progrssive Reader
                </h5>
                <ul className="py-2">
                    <ListItemButton icon={<Articles {...iconProps} />} text="Articles" href="/stream/all" onClick={close} />
                    <ListItemButton icon={<Subscriptions {...iconProps} />} text="Subscriptions" href="/subscriptions" onClick={close} />
                    <ListItemButton icon={<Settings {...iconProps} />} text="Settings" href="/settings" onClick={close} />
                    <ListItemButton icon={<About {...iconProps} />} text="About" href="/about" onClick={close} />
                    {installPrompt && <ListItemButton onClick={installPrompt} icon={<Install {...iconProps}/>} text="Install" />}
                </ul>
            </div>
        </Drawer>
    </div>;
};
