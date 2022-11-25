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
  constructor(source: Window) {
    this._source = source;

    // Listen for events
    const request$$ = new Subject<Req>();

    request$$.pipe(
      tap((req) => {
        console.info(`[#${req.sessionId}] Received ${req.type} request`);
        performance.mark(`receive-${req.sessionId}`);
      }),
      concatMap(async (req) => {
        this._sessionId = req.sessionId;

        // Log queue time
        performance.mark(`end-queue-${req.sessionId}`);
        const queue = performance.measure(`queue-${req.sessionId}`, `receive-${req.sessionId}`, `end-queue-${req.sessionId}`);
        console.info(`[#${req.sessionId}] ${req.type} waited ${queue.duration}ms`);

        try {
          return await this.handle(req);
        } finally {
          // Log compute time
          performance.mark(`end-compute-${req.sessionId}`);
          const compute = performance.measure(`compute-${req.sessionId}`, `end-queue-${req.sessionId}`, `end-compute-${req.sessionId}`);

          console.info(`[#${req.sessionId}] ${req.type} request took ${compute.duration}ms`);
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
