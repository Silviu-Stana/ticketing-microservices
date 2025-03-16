import { Publisher, Subjects, TicketCreatedEvent } from '@sealsdev/commonservice';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
