import type { Context } from 'aws-lambda';

// Types
export type Handler<E = any, R = any> = (event: E, context: Context) => Promise<R>;
export type Middleware<EO = any, RO = any, EI = EO, RI = RO> = (handler: Handler<EI, RI>) => Handler<EO, RO>;
