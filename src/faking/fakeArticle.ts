import { Article } from "../model/article";
import { fakeName } from "./utils";

export const fakeArticle = (): Article => {
    return {
        author: fakeName(),
        summary: {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non efficitur tellus, eget laoreet neque. Donec pharetra volutpat metus. Vestibulum eu efficitur mi. Curabitur at erat eu leo venenatis sollicitudin eu dignissim risus. Nulla feugiat sollicitudin blandit.',
            direction: 'ltr'
        },
        unread: true,
        title: "Headline"
    }
}