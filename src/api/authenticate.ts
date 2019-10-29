import { makeNoAuthPostRequest } from './common';
import { feedlyUrl, clientId, clientSecret } from '../feedly.json';
import { Token } from '../model/token';
import { feedlyQueryString } from './utils';

const feedlyAuthUrl = `${feedlyUrl}/auth/auth`;

interface AuthenticateOptions {
    responseType?: 'code';

    /**
     * Indicates the client that is making the request. The value passed in this parameter must exactly match the value set during the partnership program. 
     */
    clientId?: string;

    /**
     *  Determines where the response is sent. The value of this parameter must exactly match one of the values set during the partnership program (including case, and trailing ‘/’). If it is a URL, it must use HTTPS. Make sure this parameter is URL-encoded! On sandbox, the default list includes “http://localhost”, “http://localhost:8080” and “urn:ietf:wg:oauth:2.0:oob”.
     */
    redirectUri: string;

    /**
     * The permissions the app is requesting.
     */
    scope?: ["https://cloud.feedly.com/subscriptions"];

    /**
     * Indicates any state which may be useful to your application upon receipt of the response. The feedly Authorization Server roundtrips this parameter, so your application receives the same value it sent. Possible uses include redirecting the user to the correct resource in your site, nonces, and cross-site-request-forgery mitigations. Make sure this parameter is URL-encoded!
     */
    state?: string;
}

/**
 * Sends an authentication request to Feedly.
 * Note: Requires a user gesture.
 * @param options The options to send to feedly.
 */
export const getAuthUrl = (options: AuthenticateOptions) => {
    // Make sure we have some kind of value for code.
    options.responseType = options.responseType || 'code';
    options.scope = options.scope || ['https://cloud.feedly.com/subscriptions'];
    options.clientId = clientId;

    const translatedOptions = {
        'response_type': options.responseType,
        'client_id': options.clientId,
        'redirect_uri': options.redirectUri,
        'scope': options.scope.join(','),
    };

    if (options.state)
      translatedOptions['state'] = options.state;

    const query = feedlyQueryString(translatedOptions)
    return `${feedlyAuthUrl}?${query}`;
}

const tokenEndpoint = "token";
export const getToken = (options: { code: string }) => {
    options['client_id'] = clientId;
    options['client_secret'] = clientSecret;
    options['redirect_url'] = location.origin;
    options['grant_type'] = 'authorization_code';

    return makeNoAuthPostRequest<Token>(tokenEndpoint, options);
}