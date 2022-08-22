// Utils
export type Awaitable<T> = PromiseLike<T> | T;
export type ItemOf<A extends unknown[]> = A extends Array<infer T> ? T : never;

// Functions
export type Comparator<T> = (a: T, b: T) => number;
