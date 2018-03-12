export type Newable<T> = new () => T;
export type TypeGuard<T> = (obj: any) => obj is T;
