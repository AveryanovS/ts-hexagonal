import { Request } from 'express';
import { UserEntity } from '../../../../domain/entities/user.entity';

export interface UserRequestInterface extends Request {
    user: UserEntity,
}
