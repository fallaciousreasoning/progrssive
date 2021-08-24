import Image from 'next/image';

type Icon = 'about'
    | 'articles'
    | 'markunread'
    | 'markread'
    | 'menu'
    | 'refresh'
    | 'settings'
    | 'share'
    | 'subscriptions'
    | 'viewmode';

interface Props {
    icon: Icon;
}

export default function IconButton() {
    return <button className="appearance-none">
        <Image src={require('../icons/menu.svg')} alt=""/>
    </button>
}