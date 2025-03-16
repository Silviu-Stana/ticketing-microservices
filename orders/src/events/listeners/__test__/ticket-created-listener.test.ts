import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@sealsdev/commonservice';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket';

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);

    //create fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    //create fake Message
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    //assert ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
