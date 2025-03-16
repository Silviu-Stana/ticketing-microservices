import { Subjects, Publisher, OrderCancelledEvent } from '@sealsdev/commonservice';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
