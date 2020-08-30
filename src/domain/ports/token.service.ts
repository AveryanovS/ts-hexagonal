export interface TokenService {
    sign(data: { id: string }): Promise<string>
    verify(token: string): Promise<{id: string}>
}
