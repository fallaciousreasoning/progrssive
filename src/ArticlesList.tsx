import React from 'react';
import ArticleCard from "./ArticleCard";
import { fakeArticle } from "./faking/fakeArticle";
import { Article } from "./model/article";

export default (props) => {
    const articles: Article[] = [1, 2, 3, 4, 5].map(i => fakeArticle());

    return <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {articles.map((a, i) => <div style={{ flexBasis: '40%', margin: '5px' }}>
            <ArticleCard article={a} key={a.id || i} />
        </div>)}
    </div>
}