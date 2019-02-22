import config from '../../feedly.json';
const profileUrl = '/profile';

export const getProfile = async () => {
    return fetch(config.feedlyUrl + profileUrl);
}