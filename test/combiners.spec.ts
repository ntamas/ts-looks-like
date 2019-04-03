import looksLike, { allOf, anyOf } from "../src";

const { expect } = chai;

const someFunction = (): number => 42;

class SomeClass {
}

const objectsToTest = [
    undefined, null, true, false, 123, NaN, Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY, "", "string", "123string", {}, SomeClass,
    new SomeClass(), someFunction, [], [123]
];

describe("allOf() combiner", () => {
    it("should work for no arguments", () => {
        const guard = allOf();

        for (const testObject of objectsToTest) {
            expect(guard(testObject)).to.be.true;
        }
    });

    it("should work for a single argument", () => {
        const isNumber = looksLike(123);
        const guard = allOf(isNumber);
        for (const testObject of objectsToTest) {
            expect(guard(testObject)).to.equal(isNumber(testObject));
        }
    });

    it("should be able to combine two sub-guards", () => {
        const isNumber = looksLike(123);
        const isOdd = (x: number) => (x % 2 === 1);
        const guard = allOf(isNumber, isOdd);
        for (const testObject of objectsToTest) {
            if (testObject === 123) {
                expect(guard(testObject)).to.equal(
                    true, `${testObject} does not pass the combined guard`
                );
            } else {
                expect(guard(testObject)).to.equal(
                    false, `${testObject} passes the combined guard`
                );
            }
        }
    });
});

describe("anyOf() combiner", () => {
    it("should work for no arguments", () => {
        const guard = anyOf();

        for (const testObject of objectsToTest) {
            expect(guard(testObject)).to.be.false;
        }
    });

    it("should work for a single argument", () => {
        const isNumber = looksLike(123);
        const guard = anyOf(isNumber);
        for (const testObject of objectsToTest) {
            expect(guard(testObject)).to.equal(isNumber(testObject));
        }
    });

    it("should be able to combine two sub-guards", () => {
        const isNumber = looksLike(123);
        const isString = looksLike("foo");
        const guard = anyOf(isNumber, isString);
        for (const testObject of objectsToTest) {
            if (typeof testObject === "number" || typeof testObject === "string") {
                expect(guard(testObject)).to.equal(
                    true, `${testObject} does not pass the combined guard`
                );
            } else {
                expect(guard(testObject)).to.equal(
                    false, `${testObject} passes the combined guard`
                );
            }
        }
    });
});
