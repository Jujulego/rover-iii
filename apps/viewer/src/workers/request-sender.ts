import { nanoid } from 'nanoid';
import { filter, Observable, Subject } from 'rxjs';

import { Message } from './message';

// Class
export class RequestSender<Req extends Message, Msg extends Message> {
  // Attributes
  private readonly _messages$$ = new Subject<Msg>();

  readonly messages$ = this._messages$$.asObservable();

  // Constructor
  constructor(readonly worker: Worker) {
    // Listen for messages
    this.worker.addEventListener('message', (event: MessageEvent<Msg>) => {
      this._messages$$.next(event.data);
    });
  }

  // Methods
  request(req: Omit<Req, 'sessionId'>): Observable<Msg> {
    // Send request
    const sessionId = nanoid();
    this.worker.postMessage({ sessionId, ...req });

    // Observe messages
    return this.messages$.pipe(
      filter((msg) => msg.sessionId === sessionId)
    );
  }
}
