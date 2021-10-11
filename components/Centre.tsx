import * as React from 'react';

export default function Centre(props: { children: React.ReactNode, className?: string }) {
    return <div className={`${props.className} flex justify-center`}>
        {props.children}
    </div>
}