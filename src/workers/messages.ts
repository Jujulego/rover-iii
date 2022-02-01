// Types
export interface WorkerMessage<T extends string> {
  id?: string;
  type: T;
}
