import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@sealsdev/commonservice';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data);

        msg.ack();
    }
}
