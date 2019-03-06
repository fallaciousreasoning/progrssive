import { useContext } from 'react';
import * as ReactRouter from 'react-router';

export const useRouter = () => {
    return useContext(ReactRouter['__RouterContext']);
}