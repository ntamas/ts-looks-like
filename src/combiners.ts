import { looksLike } from "./looksLike";
import { LooksLikeArg, TypeGuard, UnaryPredicate } from "./types";

const alwaysFalse = (_: any) => false;
const alwaysTrue = (_: any) => true;

function makePredicates(args: LooksLikeArg[]): UnaryPredicate[] {
    return args.map(arg => looksLike(arg));
}

export function allOf<T>(
    ...args: LooksLikeArg[]
): TypeGuard<T> {
    if (args.length === 1) {
        return looksLike(args[0]);
    } else if (args.length > 1) {
        const predicates = makePredicates(args);
        return (x => predicates.every(predicate => predicate(x))) as TypeGuard<T>;
    } else {
        return alwaysTrue as TypeGuard<T>;
    }
}

export function anyOf<T>(
    ...args: LooksLikeArg[]
): TypeGuard<T> {
    if (args.length === 1) {
        return looksLike(args[0]);
    } else if (args.length > 1) {
        const predicates = makePredicates(args);
        return (x => predicates.some(predicate => predicate(x))) as TypeGuard<T>;
    } else {
        return alwaysFalse as TypeGuard<T>;
    }
}
