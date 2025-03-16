import { Publisher, Subjects } from '@sealsdev/commonservice';
import { ExpirationCompleteEvent } from '@sealsdev/commonservice';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
