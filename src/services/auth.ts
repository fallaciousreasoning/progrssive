import { getAuthUrl } from "../api/authenticate";

const tokenKey = 'authentication_token';

const searchParams = new URLSearchParams(window.location.search);
let authenticationToken = searchParams.get('code');
if (authenticationToken)
  localStorage.setItem(tokenKey, authenticationToken);

const info = {
    authenticationToken: authenticationToken || localStorage.getItem(tokenKey),
};

// If we are not authenticated, make sure we do that.
if (!info.authenticationToken) {
    window.location.href = getAuthUrl({ 
        redirectUri: window.location.href
    });
}

export default info;