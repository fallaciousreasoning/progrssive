export interface Profile {
    id: string;
    email: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
    gender?: string;
    locale: string;
}