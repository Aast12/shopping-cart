import { getModelForClass, prop } from '@typegoose/typegoose';

class Product {
    @prop({ unique: true })
    public name: String;

    @prop({})
    public price: Number;

    @prop({})
    public description?: String;

    @prop({})
    public image?: {
        data: Buffer;
        contentType: String;
    };

    @prop({})
    public brand?: String;
}

export default getModelForClass(Product);
