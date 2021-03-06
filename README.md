# ts-looks-like

Helper function to generate TypeScript type guards from an example instance.

This module exports a function named `looksLike` that can be used to generate
TypeScript type guard functions based on an example instance.

For instance, suppose that you have a model object like this:

```ts
export interface INode {
    label: string;
    color: string;
    visible: boolean;
}
```

Creating a type guard manually is tedious:

```ts
export function isNode(obj: any): obj is INode {
    return (
        typeof obj === "object" &&
        obj.hasOwnProperty("label") &&
        typeof obj.label === "string" &&
        obj.hasOwnProperty("color") &&
        typeof obj.color === "string" &&
        obj.hasOwnProperty("visible") &&
        typeof obj.label === "boolean"
    );
}
```

However, you can now use `looksLike` to generate one from an example object:

```ts
const nodeExample: INode = {
    label: "Some label",
    color: "red",
    visible: false,
};

export const isNode = looksLike(nodeExample);
```

You can also inline the example object if you give a type hint to `looksLike`:

```ts
export const isNode = looksLike<INode>({
    label: "Some label",
    color: "red",
    visible: false,
});
```

In general, `looksLike` accepts the following objects as inputs:

-   `undefined` will return a type guard that accepts `undefined` only.

-   `null` will return a type guard that accepts `null` only.

-   Passing `true` or `false` will return a type guard that accepts a boolean.

-   Passing any number will return a type guard that accepts a number.

-   Passing any string will return a type guard that accepts a string.

-   Passing any symbol will return a type guard that accepts _any_ symbol (not
    only the given one).

-   Passing any array will return a type guard that accepts arbitrary arrays
    (with arbitrary item types). See the `arrayOf()` modifier below for typed
    arrays.

-   Passing any _unary_ function is assumed to be a type guard on its own so
    the function itself will be returned.

-   Passing any other function to `looksLike` is not allowed.

-   Passing a plain object without a prototype will accept any object whose
    "shape" matches the example object (comparison is done key-wise for all keys
    in the example object, values are also treated as examples recursively using
    `looksLike`). Objects can also be nested in each other, i.e. you can put
    another object as a value for a key in a plain object. You can also pass
    additional type guards (even ones generated with `looksLike`) as values.

## Modifiers

`ts-looks-like` provides several helper functions that allow you to specify
more advanced behaviour with `looksLike`. These helper functions are called
_modifiers_; typically, they must be called with one or more arguments and
will return a type guard function that you can then pass to `looksLike` as
a value for a key in the example object. Typically, when using a modifier,
you need a type hint for `looksLike` to help TypeScript infer the proper
type; for example:

```ts
export const isNode = looksLike<INode>({
    label: "Some label",
    color: optional("red"),
    visible: false,
});
```

Supported modifiers are:

-   `arrayOf(x)` will make the type guard accept arbitrary arrays of objects
    that are of the type inferred from `x` as an example object.

-   `exactly(x)` will make the type guard accept `x` and only exactly `x`.

-   `instanceOf(x)` needs a class and will return a type guard that accepts
    objects that are instances of the given class. This can be used to work
    around the restriction that passing an object with a constructor to
    `looksLike` throws an Error:

-   `maybeNull(x)` will make the type guard accept `null` as well as the
    type inferred from `x` as an example object.

-   `maybeNil` will make the type guard accept `null` or `undefined` as well as
    the type inferred from `x` as an example object.

-   `oneOf(x)` will make the type guard accept objects that are an exact match
    for one of items in the `x` array.

-   `optional(x)` will make the type guard accept `undefined` as well as the
    type inferred from `x` as an example object. For instance, `optional(42)`
    will return a type guard that accepts numbers and undefined.

-   `record(key, x)` will make the type guard accept `Record`s whose keys
    match the `key` example value or type guard and whose values satisfy
    the `x` example object or type guard.

```ts
export const isBlogPost = looksLike<IBlogPost>({
    body: "Lorem ipsum dolor sit amet...",
    createdAt: instanceOf(Date),
    title: optional("Lorem ipsum"),
});
```

## Combiners

Multiple type guards may be combined with the `allOf()` and `anyOf()`
functions. `allOf(...)` will return a type guard that takes an object and
returns `true` if the object passes all the type guards passed to the
original `allOf()` invocation. Similarly, `anyOf(...)` will return a type
guard that returns `true` if the object passes at least one of the type
guards passed to the original `anyOf()` invocation.

These functions accept any object that is accepted by `looksLike()` itself,
so you can do something like this:

```ts
export const isNumberOrString = anyOf(123, "Lorem ipsum");
```

You can also use `allOf()` to handle interface inheritance:

```ts
export interface INode {
    label: string;
    visible: boolean;
}

export const isNode = looksLike<INode>({
    label: "Some label",
    visible: false,
});

export interface IColoredNode extends INode {
    color: string;
}

export const isColoredNode = allOf(isNode, {
    color: "red",
});
```

## Caveats

`looksLike()` is not optimized for performance and it is not expected to cover
all the possible use-cases; for instance, disjunctions of types are not covered
and there is no plan to do so. If you need something more complicated, you will
need to implement your own type guard, but you can then use this type guard
just like any other modifier described above.
