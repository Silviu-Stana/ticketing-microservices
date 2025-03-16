import mongoose, { Schema, Document, Model } from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttributes): TicketDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema<TicketDoc>(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
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

// Apply versioning plugin
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin); // Ensure the plugin is applied to the correct schema

ticketSchema.statics.findByEvent = function (event: {
    id: string;
    version: number;
}) {
    return this.findOne({ _id: event.id, version: event.version - 1 });
};

ticketSchema.statics.build = (attrs: TicketAttributes) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};

ticketSchema.methods.isReserved = async function () {
    // this = the ticket doc we just called 'isReserved()' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed,
            ],
        },
    });

    return !!existingOrder; //converts "null" to boolean, with a value of "true", then back to "false"
};

// Fix type mismatch by using correct schema
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
