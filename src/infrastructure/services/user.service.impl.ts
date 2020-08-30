import { Model, Document, Schema } from 'mongoose';
import { badRequest, notFound } from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { UserCreateData, UserService } from '../../domain/ports/user.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { MongoDatabase } from '../db/mongo.db';
import { simpleflake } from '../libs/flake';
import { ERRORS } from '../../errors';

interface UserDocument extends Document {
    _id: string,
    email: string,
    name: string,
    oauthSub: string,
    createdAt: Date,
    updatedAt: Date,
}

@injectable()
export class UserServiceImpl implements UserService {
    private readonly model: Model<UserDocument>;

    constructor(
    @inject(MongoDatabase) mongo: MongoDatabase,
    ) {
        this.model = mongo.registerModel<UserDocument>('user', new Schema<UserDocument>({
            _id: {
                type: String,
                default: simpleflake,
            },
            email: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            oauthSub: {
                type: String,
                required: true,
            },
        }, {
            timestamps: true,
        }));
    }

    async create(data: UserCreateData): Promise<UserEntity> {
        const userDoc = await new this.model({
            name: data.name,
            email: data.email,
            oauthSub: data.oauthSub,
        }).save();
        const userObj = userDoc.toObject();
        return {
            id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            oauthSub: userObj.oauthSub,
        };
    }

    async findOne(query: { id?: string; oauthSub?: string }): Promise<UserEntity> {
        const dbQuery: any = {};
        if (query.id) dbQuery._id = query.id;
        if (query.oauthSub) dbQuery.oauthSub = query.oauthSub;
        if (!Object.keys(dbQuery).length) throw badRequest(ERRORS.QUERY_NOT_PROVIDED);
        const user = await this.model.findOne(dbQuery).lean();
        if (!user) throw notFound(ERRORS.USER_NOT_FOUND);
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            oauthSub: user.oauthSub,
        };
    }
}
