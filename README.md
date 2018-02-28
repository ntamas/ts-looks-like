ts-looks-like
=============

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
    return typeof obj === "object" &&
        obj.hasOwnProperty("label") && typeof obj.label === "string" &&
        obj.hasOwnProperty("color") && typeof obj.color === "string" &&
        obj.hasOwnProperty("visible") && typeof obj.label === "boolean";
}
```

However, you can now use `looksLike` to generate one from an example object:

```ts
const nodeExample: INode = {
    label: "Some label",
    color: "red",
    visible: false
};

export const isNode = looksLike(nodeExample);
```

You can also inline the example object if you give a type hint to `looksLike`:

```ts
export const isNode = looksLike<INode>({
    label: "Some label",
    color: "red",
    visible: false
});
```

In general, `looksLike` accepts the following objects as inputs:

* `undefined` will return a type guard that accepts `undefined` only

* `null` will return a type guard that accepts `null` only

* Passing `true` or `false` will return a type guard that accepts a boolean

* Passing any number will return a type guard that accepts a number

* Passing any string will return a type guard that accepts a string

* Passing any symbol will return a type guard that accepts *any* symbol (not
  only the given one)

* Passing any function will return a type guard that accepts *any* function
  (not only the given one)

* Passing a plain object without a prototype will accept any object whose
  "shape" matches the example object (comparison is done key-wise for all keys
  in the example object, values are also treated as examples recursively using
  `looksLike`).

Optional properties are also allowed with the `optional` modifier, but in this
case you *always* need a type hint:

```ts
export const isNode = looksLike<INode>({
    label: "Some label",
    color: optional("red"),
    visible: false
});
```

`optional` will make the type guard accept `undefined` as well as the "normal"
inferred type (for the given property). If you need to accept `null` instead of
`undefined`, use the `maybeNull` modifier. `maybeNil` combines `maybeNull` and
`optional` so the type guard will accepth `undefined`, `null` and the "normal"
inferred type as well.

Passing an object with a constructor throws an Error. Typically, this happens
if you add a class as an argument to `looksLike`, in which case you need to
wrap the class in the `instanceOf` modifier to declare that you need an instance
of a specific class, without supplying an example value for that class. Just like
with the `optional` modifier, using it means that you explicitly need to tell
`looksLike()` what type the input value is expected to be so TypeScript can
infer the proper type for the generated function:

```ts
export const isBlogPost = looksLike<IBlogPost>({
    body: "Lorem ipsum dolor sit amet...",
    createdAt: instanceOf(Date),
    title: optional("Lorem ipsum")
});
```

`looksLike()` is not optimized for performance and it is not expected to cover
all the possible use-cases; for instance, disjunctions of types are not covered
and there is no plan to do so. If you need something more complicated, you will
need to implement your own type guard, but you can still use `looksLike()` as a
helper in the implementation. For instance, to allow the `createdAt` timestamp
of a blog post to be represented either as a `Date` or a `number`,
you can still write:

```ts
export type Timestamp = Date | number;

export const isTimestamp = (value: any): value is Timestamp {
    return looksLike(number)(value) || looksLike(Date)(value)
}
```
