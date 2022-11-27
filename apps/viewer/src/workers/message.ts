// Types
export interface Message<T extends string = string> {
  readonly sessionId: string;
  readonly type: T;
}
