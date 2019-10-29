export interface Token {
    id: string;
    refresh_token: string;
    access_token: string;
    expires_in: number;
    token_type: 'Bearer';
    plan: 'standard' | 'pro' | 'business';
    state?: string;
}