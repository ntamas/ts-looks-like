import looksLike, { arrayOf, instanceOf, maybeNil, maybeNull, optional } from "../src";

const { expect } = chai;

const someSymbol = Symbol("someSymbol");
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

describe("instanceOf() modifier", () => {
    it("should check whether the passed object is an instance of some class", () => {
        const guard = instanceOf(SomeClass);

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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
    });
});

describe("maybeNil() modifier", () => {
    it("should check whether the passed object is null or undefined or follows some example", () => {
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
    });
});

describe("maybeNull() modifier", () => {
    it("should check whether the passed object is null or follows some example", () => {
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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
    });
});

describe("optional() modifier", () => {
    it("should check whether the passed object is undefined or follows some example", () => {
        const guard = optional(42);

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
        expect(guard([])).to.be.false;
        expect(guard([123])).to.be.false;
    });
});

describe("arrayOf() modifier", () => {
    it("should check whether the passed object is a typed array", () => {
        const guard = arrayOf(42);

        expect(guard([])).to.be.true;
        expect(guard([123])).to.be.true;
        expect(guard([123, 888, NaN])).to.be.true;

        expect(guard(123)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
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
        expect(guard([123, "foobar"])).to.be.false;
    });
});

describe("modifier combinations", () => {
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
});
