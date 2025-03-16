import { Publisher, Subjects } from '@sealsdev/commonservice';
import { PaymentCreatedEvent } from '@sealsdev/commonservice';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
