export type Newable<T> = new () => T;
export type UnaryPredicate = (obj: any) => boolean;
export type TypeGuard<T> = (obj: any) => obj is T;
export type LooksLikeArg =
    null |
    undefined |
    boolean |
    number |
    string |
    symbol |
    any[] |
    {} |
    UnaryPredicate |
    TypeGuard<any>;
