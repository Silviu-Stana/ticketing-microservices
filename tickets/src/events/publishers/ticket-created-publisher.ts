import {
    Publisher,
    Subjects,
    TicketCreatedEvent,
} from '@sealsdev/commonservice';

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
