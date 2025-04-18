import { Listener, OrderStatus, Subjects } from '@sealsdev/commonservice';
import { ExpirationCompleteEvent } from '@sealsdev/commonservice';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) throw new Error('Order not found');

        if (order.status === OrderStatus.Completed) {
            return msg.ack();
        }

        //no reset "ticket" property because we can keep for our user a history of products ordered
        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: { id: order.ticket.id },
        });

        msg.ack();
    }
}
