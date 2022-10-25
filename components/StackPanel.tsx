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
}

const StackPanel = (props: Props & React.HTMLProps<HTMLDivElement>) => {
    let {
        direction,
        spacing,
        alignItems,
        justifyContent,
        ...rest
    } = props;
    direction = direction || 'col';
    spacing = props.spacing ?? (direction.includes('col') ? 'space-y-1' : 'space-x-1');
    alignItems = alignItems || 'stretch';
    justifyContent = justifyContent || 'start';

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];

    return <div {...rest} className={`
        flex flex-${direction} items-${alignItems} justify-${justifyContent}
        w-full h-full
        ${props.className}
        ${spacing}`}>
        {/* Filter out null children, to make adding/removing more intuitive */}
        {children.filter(c => !!c).map((c, i) => <div key={c['key'] || c['id'] || i}>
            {c}
        </div>)}
    </div>
};

export default StackPanel;
