export interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'secondary';
    variant?: 'solid' | 'outline';
}

export default function Button(props: ButtonProps) {
    const {className, color, ...rest} = props;
    const accent = color ?? 'primary';
    const fill = props.variant == 'outline' ? 'transparent' : accent;
    const text = props.variant == 'outline' ? accent : 'foreground';
    const border = props.variant == 'outline' ? `${accent}` : 'transparent';
    const borderOpacity = props.variant == 'outline' ? 80 : 0;
    const borderHoverOpacity = props.variant == 'outline' ? 100 : 0;
    return <button className={`${className}
        rounded
        bg-${fill}
        hover:opacity-80
        ripple-bg-gray-300
        text-${text}
        border border-${border} border-opacity-${borderOpacity} hover:border-opacity-${borderHoverOpacity}
        p-2`} {...rest}/>
}