interface UserInfo {
    email: string,
    name: string,
    sub: string,
}

export interface OauthService {
    getUserInfo(accessToken: string): Promise<UserInfo>;
}
