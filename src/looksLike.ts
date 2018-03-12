import { TypeGuard } from "./types";

export function looksLike(example: null): TypeGuard<null>;
export function looksLike(example: undefined): TypeGuard<undefined>;
export function looksLike(example: boolean): TypeGuard<boolean>;
export function looksLike(example: number): TypeGuard<number>;
export function looksLike(example: string): TypeGuard<string>;
export function looksLike(example: symbol): TypeGuard<symbol>;
export function looksLike<T>(example: TypeGuard<T> | any): TypeGuard<T>;
export function looksLike<T>(example: any): TypeGuard<any> {
    if (looksLikeNull(example)) {
        return looksLikeNull;
    } else if (looksLikeUndefined(example)) {
        return looksLikeUndefined;
    } else if (looksLikeBoolean(example)) {
        return looksLikeBoolean;
    } else if (looksLikeNumber(example)) {
        return looksLikeNumber;
    } else if (looksLikeString(example)) {
        return looksLikeString;
    } else if (looksLikeSymbol(example)) {
        return looksLikeSymbol;
    } else if (looksLikeUnaryFunction(example)) {
        // Bit unsafe but we cannot check whether the function always returns
        // a Boolean value
        return example as any;
    } else if (looksLikeFunction(example)) {
        throw new Error("functions are not allowed (except type guards)");
    } else if (example.constructor === Object) {
        // Plain object without a prototype
        const keysToValidators: {
            [key: string]: (value: any) => boolean;
        } = {};
        Object.keys(example).forEach(key => {
            const spec = (example as any)[key];
            keysToValidators[key] = looksLikeUnaryFunction(spec) ? spec : looksLike(spec);
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

function looksLikeUnaryFunction(obj: any): obj is (arg: any) => any {
    return looksLikeFunction(obj) && obj.length === 1;
}
