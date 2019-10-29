import { getAuthUrl, getToken } from "../api/authenticate";
import { Token } from "../model/token";

const authCodeKey = 'auth_code';

const searchParams = new URLSearchParams(window.location.search);

let onAccessTokenReceived: (token: Token) => void;
let authCode = searchParams.get('code');

const info = {
    authCode,
    accessTokenPromise: new Promise<Token>((accept) => {
        onAccessTokenReceived = accept;
    })
};

// If we are not authenticated, make sure we do that.
if (!info.authCode) {
    window.location.href = getAuthUrl({ 
        redirectUri: window.location.href
    });
} else {
    getToken({ code: info.authCode }).then(onAccessTokenReceived);
}

export default info;