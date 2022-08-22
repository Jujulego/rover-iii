import { nanoid } from 'nanoid';

import { Awaitable } from '../types';

import { WorkerMessage } from './messages';

// Class
export abstract class MessageHandler<Req extends WorkerMessage<string>, Res extends WorkerMessage<string>> {
  // Constructor
  constructor(private readonly _emitter: Window) {
    _emitter.addEventListener('message', (evt: MessageEvent<Req>) => this._receive(evt));
  }

  // Methods
  protected abstract handle(msg: Req): Awaitable<Res | void>;

  private async _receive(evt: MessageEvent<Req>): Promise<void> {
    const req = evt.data as Req;
    const res = await this.handle(req);

    if (res) {
      res.id = req.id;
      this._emitter.postMessage(res);
    }
  }

  send(msg: Res): void {
    if (!msg.id) {
      msg.id = nanoid();
    }

    this._emitter.postMessage(msg);
  }
}
