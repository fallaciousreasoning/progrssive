import config from '../../feedly.json';
import { makeRequest } from './common.js';
const profileUrl = '/profile';

export const getProfile = () => {
    return makeRequest<any>(profileUrl);
}