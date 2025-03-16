import { Publisher, OrderCreatedEvent, Subjects } from '@sealsdev/commonservice';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}
