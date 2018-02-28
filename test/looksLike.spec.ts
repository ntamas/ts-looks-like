import looksLike, { instanceOf, maybeNil, maybeNull, optional } from "../src";

const { expect } = chai;

const someSymbol = Symbol("someSymbol");
const someOtherSymbol = Symbol("someOtherSymbol");
const someFunction = (): number => 42;

class SomeClass {
}

class SomeDerivedClass extends SomeClass {
}

class SomeOtherClass {
}

interface IBlogEntry {
    body: string;
    createdAt?: Date;
    title?: string;
}

describe("looksLike", () => {
    it("should generate type guards for null", () => {
        const guard = looksLike(null);

        expect(guard(null)).to.be.true;

        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(undefined)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should generate type guards for undefined", () => {
        const guard = looksLike(undefined);

        expect(guard(undefined)).to.be.true;

        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
    });

    it("should generate type guards for booleans", () => {
        const guard = looksLike(true);

        expect(guard(true)).to.be.true;
        expect(guard(false)).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should generate type guards for numbers", () => {
        const guard = looksLike(42);

        expect(guard(123)).to.be.true;
        expect(guard(NaN)).to.be.true;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.true;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should generate type guards for strings", () => {
        const guard = looksLike("foo");

        expect(guard("")).to.be.true;
        expect(guard("string")).to.be.true;
        expect(guard("123string")).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should generate type guards for symbols", () => {
        const guard = looksLike(someSymbol);

        expect(guard(someSymbol)).to.be.true;
        expect(guard(someOtherSymbol)).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should generate type guards for functions", () => {
        const guard = looksLike(someFunction);

        expect(guard(someFunction)).to.be.true;
        expect(guard(SomeClass)).to.be.true;
        expect(guard(SomeOtherClass)).to.be.true;
        expect(guard(SomeDerivedClass)).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
    });

    it("should throw an error for example objects with constructors", () => {
        expect(() => looksLike(new SomeClass())).to.throw;
    });

    it("should generate type guards with instanceOf checks", () => {
        const guard = looksLike(instanceOf(SomeClass));

        expect(guard(new SomeClass())).to.be.true;
        expect(guard(new SomeDerivedClass())).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(SomeClass)).to.be.false;
        expect(guard(new SomeOtherClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should generate type guards for plain objects", () => {
        const guard = looksLike({
            baz: true,
            foo: "bar",
            frob: optional(42)
        });

        const basics = [
            undefined, null, true, false, 123, NaN,
            Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "",
            "string", "123string", {}, SomeClass, new SomeClass(),
            someSymbol, someFunction
        ];
        expect(basics.filter(guard)).to.be.empty;

        expect(guard({
            baz: true,
            foo: "bar",
            frob: 47
        })).to.be.true;
        expect(guard({
            baz: true,
            foo: "bar"
        })).to.be.true;
        expect(guard({
            baz: 42,
            foo: "bar"
        })).to.be.false;
        expect(guard({
            foo: "bar",
            frob: 47
        })).to.be.false;

        const instance: any = new SomeClass();
        instance.foo = "bar";
        instance.baz = true;
        instance.frob = 47;
        expect(guard(instance)).to.be.true;
    });

    it("should allow maybeNull() modifier for numbers", () => {
        const guard = looksLike(maybeNull(42));

        expect(guard(123)).to.be.true;
        expect(guard(NaN)).to.be.true;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.true;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.true;
        expect(guard(null)).to.be.true;

        expect(guard(undefined)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should allow optional() modifier for numbers", () => {
        const guard = looksLike(optional(42));

        expect(guard(123)).to.be.true;
        expect(guard(NaN)).to.be.true;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.true;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.true;
        expect(guard(undefined)).to.be.true;

        expect(guard(null)).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should be able to combine optional() and instanceOf()", () => {
        const guard = looksLike<IBlogEntry>({
            body: "Lorem ipsum dolor sit amet...",
            createdAt: optional(instanceOf(Date)),
            title: optional("Lorem ipsum")
        });

        expect(guard({})).to.be.false;
        expect(guard({ body: "Foo" })).to.be.true;
        expect(guard({ body: "Foo", createdAt: new Date() })).to.be.true;
        expect(guard({ body: "Foo", createdAt: false })).to.be.false;
        expect(guard({ body: "Foo", createdAt: false, title: "Bar" })).to.be.false;
    });

    it("should be able to combine optional() and maybeNull() as maybeNil()", () => {
        const guard = looksLike(maybeNil(42));

        expect(guard(123)).to.be.true;
        expect(guard(NaN)).to.be.true;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.true;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.true;
        expect(guard(undefined)).to.be.true;
        expect(guard(null)).to.be.true;

        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard("")).to.be.false;
        expect(guard("string")).to.be.false;
        expect(guard("123string")).to.be.false;
        expect(guard({})).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
    });

    it("should not allow objects with constructors but no prototypes", () => {
        const object = Object.create(SomeClass.prototype);
        expect(() => looksLike(object)).to.throw();
    });
});
