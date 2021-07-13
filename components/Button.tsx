export interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'secondary';
    variant?: 'solid' | 'outline';
}

export default function Button(props: ButtonProps) {
    const {className, color, ...rest} = props;
    const accent = color ?? 'primary';
    const fill = props.variant == 'outline' ? 'transparent' : accent;
    const hover = props.variant == 'outline' ? 'transparent' : `${accent}-hover`;
    const text = props.variant == 'outline' ? accent : 'foreground';
    const border = props.variant == 'outline' ? `${accent}-hover` : 'transparent';
    const borderHover = props.variant == 'outline' ? accent : 'transparent';
    return <button className={`${className} rounded bg-${fill} hover:bg-${hover} ripple-bg-gray-300 text-${text} border border-${border} hover:border-${borderHover} p-2`} {...rest}/>
}