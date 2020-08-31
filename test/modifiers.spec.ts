import looksLike, {
    arrayOf,
    exactly,
    instanceOf,
    maybeNil,
    maybeNull,
    oneOf,
    optional,
    record,
} from "../src";

const { expect } = chai;

const someSymbol = Symbol("someSymbol");
const someFunction = (): number => 42;

class SomeClass {}

class SomeDerivedClass extends SomeClass {}

class SomeOtherClass {}

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

describe("exactly() modifier", () => {
    it("should check whether the passed object is an exact match", () => {
        const guard = exactly("foo");

        expect(guard("foo")).to.be.true;
        expect(guard("bar")).to.be.false;
        expect(guard(1)).to.be.false;
        expect(guard(true)).to.be.false;

        const o = {};
        const anotherGuard = exactly(o);

        expect(anotherGuard(o)).to.be.true;
        expect(anotherGuard({})).to.be.false;
    });
});

describe("oneOf() modifier", () => {
    it("should check whether the passed object is an exact match for one of the guard values", () => {
        const guard = oneOf([11, 22, 33, "44", "55"]);

        expect(guard(11)).to.be.true;
        expect(guard(22)).to.be.true;
        expect(guard(33)).to.be.true;
        expect(guard("44")).to.be.true;
        expect(guard("55")).to.be.true;

        expect(guard(1)).to.be.false;
        expect(guard(2)).to.be.false;
        expect(guard(333)).to.be.false;
        expect(guard(44)).to.be.false;
        expect(guard(55)).to.be.false;
    });
});

describe("record() modifier", () => {
    it("should generate type guards for Record<string, number>", () => {
        const guard = record("", 42);

        expect(guard({})).to.be.true;
        expect(guard({ foo: 42, bar: 97 })).to.be.true;
        expect(guard({ [42]: 42, bar: 97 })).to.be.true;
        expect(guard({ foo: 42, bar: NaN })).to.be.true;
        expect(guard({ bar: Number.POSITIVE_INFINITY })).to.be.true;
        expect(guard({ bar: Number.NEGATIVE_INFINITY })).to.be.true;

        expect(guard({ foo: 42, bar: true })).to.be.false;
        expect(guard({ foo: 42, bar: false })).to.be.false;
        expect(guard({ bar: undefined })).to.be.false;
        expect(guard({ bar: null })).to.be.false;
        expect(guard({ foo: 97, bar: "42" })).to.be.false;
        expect(guard({ foo: 42, bar: {} })).to.be.false;
        expect(guard({ foo: 42, bar: new SomeClass() })).to.be.false;
        expect(guard({ foo: 42, bar: someSymbol })).to.be.false;
        expect(guard({ foo: someFunction })).to.be.false;
        expect(guard({ foo: [] })).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(42)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard(SomeClass)).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
        expect(guard([])).to.be.false;
    });

    it("should generate type guards for Record<number, string>", () => {
        const guard = record(42, "");

        expect(guard({})).to.be.true;
        expect(guard({ [1]: "Foo", [2]: "" })).to.be.true;

        expect(guard({ [1]: "Foo", [2]: true })).to.be.false;
        expect(guard({ [1]: "Foo", [2]: false })).to.be.false;
        expect(guard({ [2]: undefined })).to.be.false;
        expect(guard({ [2]: null })).to.be.false;
        expect(guard({ [1]: "Foo", [2]: 42 })).to.be.false;
        expect(guard({ [1]: "Foo", [2]: NaN })).to.be.false;
        expect(guard({ [2]: Number.POSITIVE_INFINITY })).to.be.false;
        expect(guard({ [2]: Number.NEGATIVE_INFINITY })).to.be.false;
        expect(guard({ [1]: "Foo", [2]: {} })).to.be.false;
        expect(guard({ [1]: "Foo", [2]: new SomeClass() })).to.be.false;
        expect(guard({ [1]: "Foo", [2]: someSymbol })).to.be.false;
        expect(guard({ [1]: someFunction })).to.be.false;
        expect(guard({ [1]: [] })).to.be.false;
        expect(guard(true)).to.be.false;
        expect(guard(false)).to.be.false;
        expect(guard(undefined)).to.be.false;
        expect(guard(null)).to.be.false;
        expect(guard(42)).to.be.false;
        expect(guard(NaN)).to.be.false;
        expect(guard(Number.POSITIVE_INFINITY)).to.be.false;
        expect(guard(Number.NEGATIVE_INFINITY)).to.be.false;
        expect(guard(SomeClass)).to.be.false;
        expect(guard(new SomeClass())).to.be.false;
        expect(guard(someSymbol)).to.be.false;
        expect(guard(someFunction)).to.be.false;
        expect(guard([])).to.be.false;
    });
});

describe("modifier combinations", () => {
    it("should be able to combine optional() and instanceOf()", () => {
        const guard = looksLike<IBlogEntry>({
            body: "Lorem ipsum dolor sit amet...",
            createdAt: optional(instanceOf(Date)),
            title: optional("Lorem ipsum"),
        });

        expect(guard({})).to.be.false;
        expect(guard({ body: "Foo" })).to.be.true;
        expect(guard({ body: "Foo", createdAt: new Date() })).to.be.true;
        expect(guard({ body: "Foo", createdAt: false })).to.be.false;
        expect(guard({ body: "Foo", createdAt: false, title: "Bar" })).to.be
            .false;
    });
});
