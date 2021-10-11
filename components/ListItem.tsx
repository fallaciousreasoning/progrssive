export interface ListItemProps {
    children?: React.ReactNode;
    secondary?: string;
    primary?: string;
    onTextClick?: (e: React.MouseEvent) => void;
}

export default function ListItem(props: ListItemProps) {
    return <li className="px-4 py-2 flex flex-row items-start">
        <div className="flex flex-col flex-1" onClick={props.onTextClick}>
            {props.primary && <span className="text-lg">{props.primary}</span>}
            {props.secondary && <span className="font-light">{props.secondary}</span>}
        </div>
        {props.children}
    </li>
}