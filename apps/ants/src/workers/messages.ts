// Types
export interface WorkerMessage<T extends string> {
  id?: string;
  type: T;
}

export type WorkerResultOf<T extends string, Res extends WorkerMessage<T>> = Extract<Res, { type: T }>
