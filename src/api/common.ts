import snakeCase  from "snake-case"
import queryString from "querystring"

export const feedlyQueryString = (params: Object): string => {
    const fixedCase = {};
    for (const key in params) {
        fixedCase[snakeCase(key)] = params[key];
    }

    return queryString.stringify(fixedCase);
}