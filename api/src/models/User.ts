import { getModelForClass, mongoose, pre, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { Order } from './Order';

@pre<User>('save', function (next) {
    const user = this;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError);
            } else {
                bcrypt.hash(user.password, salt, function (hashError, hash) {
                    if (hashError) {
                        return next(hashError);
                    }

                    user.password = hash;
                    next();
                });
            }
        });
    } else {
        return next();
    }
})
export class User {
    @prop({})
    public givenName: string;

    @prop({})
    public lastName: string;

    @prop({})
    public dateOfBirth?: Date;

    @prop({ unique: true })
    public email: string;

    @prop({})
    public password: string;

    @prop({ default: 'user' })
    public role: 'admin' | 'user';

    @prop({})
    public profilePicture?: {
        data: Buffer;
        contentType: string;
    };

    @prop({ _id: true, default: [] })
    public orders: mongoose.Types.Array<Order>;
}

export default getModelForClass(User, {
    schemaOptions: { timestamps: true },
});
