import {
    getModelForClass,
    mongoose,
    pre,
    prop,
    Ref,
} from '@typegoose/typegoose';
import { Product } from './Product';
import bcrypt from 'bcrypt';
export class Order {
    @prop({})
    public products: mongoose.Types.Array<{
        product: Ref<Product>;
        quantity: number;
        unitPrice: number;
    }>;

    @prop({})
    public total: number;

    @prop({ default: Date.now() })
    public date: Date;
}

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
class User {
    @prop({})
    public givenName: string;

    @prop({})
    public lastName: string;

    @prop({})
    public dateOfBirth?: Date;

    @prop({})
    public email: string;

    @prop({})
    public password: string;

    @prop({})
    public profilePicture?: {
        data: Buffer;
        contentType: string;
    };

    @prop({ _id: true, default: [] })
    public orders?: mongoose.Types.Array<Order>;
}

export default getModelForClass(User, {
    schemaOptions: { timestamps: true },
});
