import {
    Publisher,
    Subjects,
    TicketUpdatedEvent,
} from '@sealsdev/commonservice';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
