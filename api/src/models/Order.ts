import { getModelForClass, mongoose, prop, Ref } from '@typegoose/typegoose';
import { Product } from './Product';

export class OrderItem {
    product: Ref<Product>;
    quantity: number;
    unitPrice: number;
}

export class Order {
    @prop({ default: [] })
    public products: mongoose.Types.Array<OrderItem>;

    @prop({})
    public total: number;

    @prop({ required: true, default: Date.now })
    public date: Date;
}

export default getModelForClass(Order);
