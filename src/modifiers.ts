import { looksLike } from "./looksLike";
import type { Newable, TypeGuard } from "./types";

export function arrayOf<T>(typicalItem: T | TypeGuard<T>): TypeGuard<T[]> {
    const validator = looksLike<T>(typicalItem);
    return (obj: any): obj is T[] => {
        return Array.isArray(obj) && obj.every((item) => validator(item));
    };
}

export function exactly<T>(value: T): TypeGuard<T> {
    return (obj: any): obj is T => obj === value;
}

export function instanceOf<T>(someClass: Newable<T>): TypeGuard<T> {
    return (obj: any): obj is T => {
        return obj instanceof someClass;
    };
}

export function maybeNil<T>(value: T): TypeGuard<T | undefined | null> {
    const validator = looksLike(value);
    return (obj: any): obj is T | null => {
        return obj === null || obj === undefined || validator(obj);
    };
}

export function maybeNull<T>(value: T): TypeGuard<T | null> {
    const validator = looksLike(value);
    return (obj: any): obj is T | null => {
        return obj === null || validator(obj);
    };
}

export function oneOf<T>(values: T[]): TypeGuard<T> {
    return (obj: any): obj is T => values.indexOf(obj) >= 0;
}

export function optional<T>(value: T): TypeGuard<T | undefined> {
    const validator = looksLike(value);
    return (obj: any): obj is T | undefined => {
        return obj === undefined || validator(obj);
    };
}

export function record<TValue>(
    key: string | TypeGuard<string>,
    value: TValue | TypeGuard<TValue>
): TypeGuard<Record<string, TValue | undefined>>;
export function record<TValue>(
    key: number | TypeGuard<number>,
    value: TValue | TypeGuard<TValue>
): TypeGuard<Record<number, TValue | undefined>>;
export function record<TValue, TKey extends string | number>(
    _key: TKey | TypeGuard<TKey>,
    value: TValue | TypeGuard<TValue>
): TypeGuard<Record<TKey, TValue | undefined>> {
    const looksLikeKey = looksLike(""); // looksLike(key) would look correct, but keys are always strings.
    const looksLikeValue = looksLike(value);

    return (obj: any): obj is Record<TKey, TValue | undefined> => {
        return (
            typeof obj === "object" &&
            obj !== null &&
            obj.constructor === Object &&
            !Array.isArray(obj) &&
            Object.entries(obj).every(
                ([k, v]) => looksLikeKey(k) && looksLikeValue(v)
            )
        );
    };
}
