export const modifiers = Symbol();
export const propertyModifier = Symbol();

export type Newable<T> = new () => T;

export interface IInstanceOfModifier<T> {
    instanceOf: Newable<T>;
}

export interface IInstanceOfSpec<T> {
    [modifiers]: IInstanceOfModifier<T>;
}

export interface IMaybeNullPropertyModifier {
    [propertyModifier]: true;
    maybeNull: true;
}

export interface IOptionalPropertyModifier {
    [propertyModifier]: true;
    optional: true;
}

export type IPropertyModifier = IOptionalPropertyModifier | IMaybeNullPropertyModifier;

export interface IPropertySpec<T> {
    [modifiers]: IPropertyModifier;
    value: T;
}

export interface IMaybeNullPropertySpec<T> {
    [modifiers]: IMaybeNullPropertyModifier;
    value: T;
}

export interface IOptionalPropertySpec<T> {
    [modifiers]: IOptionalPropertyModifier;
    value: T;
}

export function hasInstanceOfModifier<T>(obj: any): obj is IInstanceOfSpec<T> {
    return obj.hasOwnProperty(modifiers) && obj[modifiers].hasOwnProperty("instanceOf");
}

export function hasMaybeNullPropertyModifier<T>(obj: any): obj is IMaybeNullPropertySpec<T> {
    return hasPropertyModifier(obj) &&
        obj[modifiers].hasOwnProperty("maybeNull") &&
        (obj[modifiers] as any).maybeNull === true;
}

export function hasOptionalPropertyModifier<T>(obj: any): obj is IOptionalPropertySpec<T> {
    return hasPropertyModifier(obj) &&
        obj[modifiers].hasOwnProperty("optional") &&
        (obj[modifiers] as any).optional === true;
}

export function hasPropertyModifier<T>(obj: any): obj is IPropertySpec<T> {
    return obj.hasOwnProperty(modifiers) &&
        obj[modifiers].hasOwnProperty(propertyModifier) &&
        obj[modifiers][propertyModifier] === true;
}

export function instanceOf<T>(someClass: Newable<T>): IInstanceOfSpec<T> {
    return {
        [modifiers]: {
            instanceOf: someClass
        }
    };
}

export function maybeNil<T>(value: T): IPropertySpec<IPropertySpec<T>> {
    return optional(maybeNull(value));
}

export function maybeNull<T>(value: T): IPropertySpec<T> {
    return {
        [modifiers]: {
            [propertyModifier]: true,
            maybeNull: true
        },
        value
    };
}

export function optional<T>(value: T): IPropertySpec<T> {
    return {
        [modifiers]: {
            [propertyModifier]: true,
            optional: true
        },
        value
    };
}
