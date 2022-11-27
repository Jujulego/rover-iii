import ms from 'pretty-ms';
import { concatMap, Subject, tap } from 'rxjs';

import { Message } from './message';

// Types
export type Awaitable<T> = PromiseLike<T> | T;

// Class
export abstract class WorkerHandler<Req extends Message, Msg extends Message> {
  // Attributes
  private readonly _source: Window;

  private _sessionId: string;

  // Constructor
  constructor(
    readonly name: string,
    source: Window,
  ) {
    this._source = source;

    // Listen for events
    const request$$ = new Subject<Req>();

    request$$.pipe(
      tap((req) => {
        console.info(`[${this.name}] Received ${req.type} request (#${req.sessionId})`);
        performance.mark(`receive-${req.sessionId}`);
      }),
      concatMap(async (req) => {
        this._sessionId = req.sessionId;

        // Log queue time
        performance.mark(`end-queue-${req.sessionId}`);
        const queue = performance.measure(`queue-${req.sessionId}`, `receive-${req.sessionId}`, `end-queue-${req.sessionId}`);
        console.info(`[${this.name}] ${req.type} waited ${ms(queue.duration)} (#${req.sessionId})`);

        try {
          return await this.handle(req);
        } finally {
          // Log compute time
          performance.mark(`end-compute-${req.sessionId}`);
          const compute = performance.measure(`compute-${req.sessionId}`, `end-queue-${req.sessionId}`, `end-compute-${req.sessionId}`);

          console.info(`[${this.name}] ${req.type} request took ${ms(compute.duration)} (#${req.sessionId})`);
        }
      }),
    ).subscribe((res) => {
      if (res) {
        this.send(res);
      }
    });

    this._source.addEventListener('message', (event: MessageEvent<Req>) => {
      request$$.next(event.data);
    });

    // Worker is ready
    this._source.postMessage({
      sessionId: '--init--',
      type: '--started--',
    });
  }

  // Methods
  protected abstract handle(request: Req): Awaitable<Msg | void>;

  protected send(msg: Msg): void {
    this._source.postMessage(msg);
  }

  // Properties
  protected get sessionId(): string {
    return `[#${this._sessionId}]`;
  }
}
