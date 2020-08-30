import 'reflect-metadata';
import {
    anything, deepEqual, instance, mock, when,
} from 'ts-mockito';
import { LoginUsecase } from '../login.usecase';
import { UserService } from '../../../ports/user.service';
import { TokenService } from '../../../ports/token.service';
import { OauthService } from '../../../ports/oauth.service';
import { Logger } from '../../../../infrastructure/logger/logger';

describe('Login usecase', () => {
    const userService = mock<UserService>();
    const tokenService = mock<TokenService>();
    const oauthService = mock<OauthService>();

    when(tokenService.sign(deepEqual({ id: 'created_id' }))).thenResolve('created_user_token');
    when(tokenService.sign(deepEqual({ id: 'found_id' }))).thenResolve('found_user_token');

    when(oauthService.getUserInfo('existing_oauth_token')).thenResolve({
        name: 'test',
        sub: 'existing_sub',
        email: 'test',
    });
    when(oauthService.getUserInfo('new_oauth_token')).thenResolve({
        name: 'test',
        sub: 'new_sub',
        email: 'test',
    });

    when(userService.create(anything())).thenResolve({
        id: 'created_id',
        name: 'test',
        oauthSub: 'sub',
        email: 'email',
    });
    when(userService.findOne(deepEqual({ oauthSub: 'existing_sub' }))).thenResolve({
        id: 'found_id',
        name: 'test',
        email: 'test',
        oauthSub: 'test',
    });
    when(userService.findOne(deepEqual({ oauthSub: 'new_sub' })))
        .thenReject(new Error('not_found'));

    const usecase = new LoginUsecase(
        instance(oauthService),
        instance(userService),
        instance(tokenService),
        new Logger(),
    );

    describe('Existing user', () => {
        it('Returns token', async () => {
            const result = await usecase.exec({ accessToken: 'existing_oauth_token' });
            expect(result).toHaveProperty('data');
            expect(result.data).toHaveProperty('token');
            expect(result.data.token).toBe('found_user_token');
        });
    });
    describe('New user', () => {
        it('Returns token', async () => {
            const result = await usecase.exec({ accessToken: 'new_oauth_token' });
            expect(result).toHaveProperty('data');
            expect(result.data).toHaveProperty('token');
            expect(result.data.token).toBe('created_user_token');
        });
    });
});
