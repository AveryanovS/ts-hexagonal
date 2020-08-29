export interface TokenService {
    sign(data: {
        id: string,
    }): Promise<string>
}
