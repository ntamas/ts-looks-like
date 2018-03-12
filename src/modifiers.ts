import { looksLike } from "./looksLike";
import { Newable, TypeGuard } from "./types";

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

export function optional<T>(value: T): TypeGuard<T | undefined> {
    const validator = looksLike(value);
    return (obj: any): obj is T | undefined => {
        return obj === undefined || validator(obj);
    };
}

export function arrayOf<T>(typicalItem: T | TypeGuard<T>): TypeGuard<T[]> {
    const validator = looksLike<T>(typicalItem);
    return (obj: any): obj is T[] => {
        return Array.isArray(obj) && obj.every(item => validator(item));
    };
}
