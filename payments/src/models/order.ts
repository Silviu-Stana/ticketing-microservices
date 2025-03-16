import { OrderStatus } from '@sealsdev/commonservice';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    //id is already listed inside the interface we extend
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttributes): OrderDoc;
}

//we don't include version: automatically managed by our updateIfCurrent plugin
const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

orderSchema.statics.build = (attrs: OrderAttributes) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
