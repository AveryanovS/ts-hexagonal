import Joi from '@hapi/joi';
import { badRequest } from '@hapi/boom';
import { ERRORS } from '../../../../../errors';

interface LoginData {
    accessToken: string,
}

const schema = Joi.object<LoginData>({
    accessToken: Joi.string().required(),
});

export function validate(data: any): LoginData {
    const { error, value } = schema.validate(data);
    if (error) throw badRequest(ERRORS.ACCESS_TOKEN_REQUIRED);
    return value;
}
