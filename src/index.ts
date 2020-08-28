import { looksLike } from "./looksLike";

export { allOf, anyOf } from "./combiners";
export { looksLike } from "./looksLike";
export {
    arrayOf,
    exactly,
    instanceOf,
    maybeNil,
    maybeNull,
    oneOf,
    optional,
    record,
} from "./modifiers";
export { TypeGuard } from "./types";

export default looksLike;
