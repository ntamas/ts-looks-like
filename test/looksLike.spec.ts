import looksLike, { optional } from "../src";

const { expect } = chai;

const someSymbol = Symbol("someSymbol");
const someOtherSymbol = Symbol("someOtherSymbol");
const someFunction = (): number => 42;
const someUnaryFunction = (x: any) => x === 42;
const someBinaryFunction = (x: number, y: number) => x + y;

class SomeClass {
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
    });

    it("should generate type guards for untyped arrays", () => {
        const guard = looksLike([123, 456]);

        expect(guard([])).to.be.true;
        expect(guard([123])).to.be.true;
        expect(guard(["foo", NaN])).to.be.true;

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
        expect(guard(someFunction)).to.be.false;
    });

    it("should simply return unary functions intact (assuming to be type guards)", () => {
        const guard = looksLike(someUnaryFunction);
        expect(guard).to.equal(someUnaryFunction);
    });

    it("should throw an error for functions with not exactly one argument", () => {
        expect(() => looksLike(someFunction)).to.throw;
        expect(() => looksLike(someBinaryFunction)).to.throw;
    });

    it("should throw an error for example objects with constructors", () => {
        expect(() => looksLike(new SomeClass())).to.throw;
    });

    it("should throw an error for objects with constructors but no prototypes", () => {
        const object = Object.create(SomeClass.prototype);
        expect(() => looksLike(object)).to.throw();
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

    it("should generate type guards for plain objects with nested sub-objects", () => {
        const guard = looksLike({
            baz: true,
            foo: {
                frob: optional(42),
                quux: "bar"
            }
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
            foo: {
                frob: 47,
                quux: "bar"
            }
        })).to.be.true;
        expect(guard({
            baz: true,
            foo: {
                quux: "bar"
            }
        })).to.be.true;
        expect(guard({
            baz: 42,
            foo: {
                quux: "bar"
            }
        })).to.be.false;
        expect(guard({
            foo: {
                frob: 47,
                quux: "bar"
            }
        })).to.be.false;

        const instance: any = new SomeClass();
        instance.foo = {
            frob: 47,
            quux: "bar"
        };
        instance.baz = true;
        expect(guard(instance)).to.be.true;
    });
});
