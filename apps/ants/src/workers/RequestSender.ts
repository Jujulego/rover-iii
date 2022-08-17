import { nanoid } from 'nanoid';
import { filter, Observable, Subject } from 'rxjs';

import { WorkerMessage, WorkerResultOf } from './messages';

// Class
export class RequestSender<Req extends WorkerMessage<string>, Res extends WorkerMessage<string>> {
  // Attributes
  private readonly _results$$ = new Subject<Res>();
  readonly results$ = this._results$$.asObservable();

  // Constructor
  constructor(private readonly _worker: Worker) {
    // Setup results obs
    _worker.addEventListener('message', (msg: MessageEvent<Res>) => {
      this._results$$.next(msg.data);
    });
  }

  // Methods
  request<R extends Req>(req: R): Observable<WorkerResultOf<R['type'], Res>> {
    // Send message
    req.id = nanoid();
    this._worker.postMessage(req);

    // Observe results
    return this.results$.pipe(
      filter((res): res is WorkerResultOf<R['type'], Res> => res.id === req.id),
    );
  }
}
