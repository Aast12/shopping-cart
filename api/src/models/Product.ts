import { getModelForClass, prop } from '@typegoose/typegoose';

export class Product {
    @prop({ unique: true })
    public name: string;

    @prop({})
    public price: number;

    @prop({})
    public description?: string;

    @prop({})
    public image?: {
        data: Buffer;
        contentType: string;
    };

    @prop({})
    public brand?: string;

    @prop({ default: 0 })
    public stock: number;

    @prop({ default: 0 })
    public views?: number;

    @prop({})
    public lastView?: Date;
}

export default getModelForClass(Product, {
    schemaOptions: { timestamps: true },
});
