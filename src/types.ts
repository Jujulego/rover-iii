// Utils
export type ItemOf<A extends unknown[]> = A extends Array<infer T> ? T : never;
