import { OrderCancelledEvent, OrderStatus } from '@sealsdev/commonservice';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from '../listeners/order-cancelled-listener';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        userId: 'awdoih',
        price: 20,
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1, //order.version=0 (has old non updated value)
        ticket: {
            id: 'awpolkh',
        },
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    return { listener, msg, data, order };
};

it('updates the status of the order', async () => {
    const { listener, msg, data, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, msg, data, order } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
