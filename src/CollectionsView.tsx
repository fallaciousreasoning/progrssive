import * as React from 'react';
import CollectionView from './CollectionView';
import { useCollections } from './hooks/collections';

export default (props) => {
    const categories = useCollections();
    return <>
        {categories.map(c => <CollectionView collection={c} key={c.id}/>)}
    </>;
}