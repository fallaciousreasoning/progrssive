import { makeRequest } from './common';
import { Profile } from '../model/profile';
const profileUrl = '/profile';

export const getProfile = () => {
    return makeRequest<Profile>(profileUrl);
}