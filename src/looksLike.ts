import {
    hasInstanceOfModifier,
    hasMaybeNullPropertyModifier,
    hasOptionalPropertyModifier,
    IInstanceOfSpec,
    IOptionalPropertySpec,
    modifiers
} from "./modifiers";

export function looksLike(example: null): (obj: any) => obj is null;
export function looksLike(example: undefined): (obj: any) => obj is undefined;
export function looksLike(example: boolean): (obj: any) => obj is boolean;
export function looksLike(example: number): (obj: any) => obj is number;
export function looksLike(example: string): (obj: any) => obj is string;
export function looksLike(example: symbol): (obj: any) => obj is symbol;
export function looksLike<T>(example: IOptionalPropertySpec<T>): (obj: any) => obj is T | undefined;
export function looksLike<T>(example: IInstanceOfSpec<T> | T | any): (obj: any) => obj is T;
export function looksLike<T>(example: T): (obj: any) => any {
    if (looksLikeNull(example)) {
        return looksLikeNull as any;
    } else if (looksLikeUndefined(example)) {
        return looksLikeUndefined as any;
    } else if (looksLikeBoolean(example)) {
        return looksLikeBoolean as any;
    } else if (looksLikeNumber(example)) {
        return looksLikeNumber as any;
    } else if (looksLikeString(example)) {
        return looksLikeString as any;
    } else if (looksLikeSymbol(example)) {
        return looksLikeSymbol as any;
    } else if (looksLikeFunction(example)) {
        return looksLikeFunction as any;
    } else if (hasInstanceOfModifier(example)) {
        const prototype = example[modifiers].instanceOf;
        return (obj: any): obj is T => obj instanceof prototype;
    } else if (hasOptionalPropertyModifier<T>(example)) {
        const validator = looksLike<T>(example.value);
        return (obj: any): obj is (T | undefined) => (obj === undefined || validator(obj));
    } else if (hasMaybeNullPropertyModifier<T>(example)) {
        const validator = looksLike<T>(example.value);
        return (obj: any): obj is (T | null) => (obj === null || validator(obj));
    } else if (example.constructor === Object) {
        // Plain object without a prototype
        const keysToValidators: {
            [key: string]: (value: any) => boolean;
        } = {};
        Object.keys(example).forEach(key => {
            const spec = (example as any)[key];
            keysToValidators[key] = looksLike(spec);
        });
        const allKeys = Object.keys(keysToValidators);
        return (obj: any): obj is T => {
            return typeof obj === "object" && obj !== null &&
                allKeys.every(key => keysToValidators[key](obj[key]));
        };
    } else if (example.constructor !== undefined) {
        throw new Error("example objects with constructors are not supported");
    } else {
        throw new Error("unhandled example object type: " + example);
    }
}

function looksLikeNull(obj: any): obj is null {
    return obj === null;
}

function looksLikeUndefined(obj: any): obj is undefined {
    return obj === undefined;
}

function looksLikeBoolean(obj: any): obj is boolean {
    return typeof obj === "boolean";
}

function looksLikeFunction(obj: any): obj is () => any {
    return typeof obj === "function";
}

function looksLikeNumber(obj: any): obj is number {
    return typeof obj === "number";
}

function looksLikeString(obj: any): obj is string {
    return typeof obj === "string";
}

function looksLikeSymbol(obj: any): obj is symbol {
    return typeof obj === "symbol";
}
