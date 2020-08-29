import { UserEntity } from '../entities/user.entity';

interface UserCreateData {
    email: string,
    name: string,
    oauthSub: string,
}

export interface UserService {
    findOne(query: {
        id?: string,
        oauthSub?: string,
    }): Promise<UserEntity>;

    create(data: UserCreateData): Promise<UserEntity>;
}
