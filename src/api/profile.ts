import { makeRequest } from './common';
const profileUrl = '/profile';

export const getProfile = () => {
    return makeRequest<any>(profileUrl);
}