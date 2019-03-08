import * as React from 'react';
import CategoryView from './CategoryView';
import { useCategories } from './hooks/subscription';

export default (props) => {
    const categories = useCategories();
    console.log("Bar")
    
    return <>
        {categories.map(c => <CategoryView category={c}/>)}
    </>;
}