import { useTheme } from "@/hooks/responsive";
import { useSettings } from "@/services/settings";
import { getColorForTheme, getContrastingColor, isDark } from "@/styles/colors";

export interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'secondary';
    variant?: 'solid' | 'outline';
    disabled?: boolean;
}

export default function Button(props: ButtonProps) {
    const {className, color, onClick, ...rest} = props;
    const theme = useTheme();
    const settings = useSettings();
    const accent = color ?? 'primary';
    const fill = props.variant == 'outline' ? 'transparent' : accent;
    const text = props.variant == 'outline' ? accent : getContrastingColor(getColorForTheme(color == 'primary'
        ? settings.accent
        : settings.secondaryAccent,
    theme));
    const border = props.variant == 'outline' ? `${accent}` : 'transparent';
    const borderOpacity = props.variant == 'outline' ? 80 : 0;
    const borderHoverOpacity = props.variant == 'outline' ? 100 : 0;
    return <button className={`${className}
        flex justify-center text-center
        rounded
        bg-${fill}
        hover:opacity-80
        ripple-bg-gray-300
        text-${text}
        border border-${border} border-opacity-${borderOpacity} hover:border-opacity-${borderHoverOpacity}
        p-2`}
        onClick={!props.disabled ? onClick : undefined}
        {...rest}/>
}