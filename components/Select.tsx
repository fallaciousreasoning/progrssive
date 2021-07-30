import { useMemo } from "react"

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {

}

const defaultClassName = "appearance-none inline-block appearance-none p-2 border-solid border-gray-400 border-1 bg-no-repeat select-caret rounded shadow";
export default function Select(props: SelectProps) {
    const { className: propsClass, ...rest } = props;
    const className = useMemo(() => `${defaultClassName} ${propsClass}`, [propsClass]);
    return <select className={className} {...rest}/>
}