import { Eq } from "./Leibniz";
import {
    NotEq,
    Sub, NotSub, StrictSub, NotStrictSub,
    Super, NotSuper, StrictSuper, NotStrictSuper,
    Disjoint
} from "./Proofs";

/**
 * Group a block of code into a test to verify that the block of code compiles.
 * Returning an object or array literal can be used to group together multiple
 * tests. The optional type parameter may be used to document the purpose of the
 * test. For example:
 *
 * <code>
 * test<"these function calls all compile">(() => [
 *     foo(3),
 *     bar("test"),
 *     baz(foo),
 * ]);
 * </code>
 *
 * This is no different than just using the code at the top level, but can be
 * used for logical grouping, conveying intent, and for avoiding
 * declared-but-not-used warnings.
 */
export function test<_doc = "">(_: () => void): void {}

/**
 * Test that two types are equal. The optional third type parameter may be used
 * to document the purpose of the test. Usually, it suffices to pass 'refl' as
 * the only argument; this is needed to instantiate the impredicative type. For
 * example:
 *
 * <code>
 * const x = 3;
 * testEq<
 *     typeof x,
 *     3,
 *     "const infers a literal type"
 * >(refl);
 *
 * let y = 3;
 * testEq<
 *     typeof y,
 *     number,
 *     "let infers a broader type"
 * >(refl);
 * </code>
 *
 * If the third parameter is left out, the test is anonymous.
 *
 * If the test fails, useful information about the error should begin at the
 * third line of the type mismatch error message.
 */
export function testEq<A, B, _doc = "">(p: Eq<A, B>): Eq<A, B> {
    return p;
}

/**
 * Test that the two types are not the same type. The optional third type
 * parameter may be used to document the purpose of the test. For example:
 *
 * <code>
 * testNotEq<
 *     3,
 *     number,
 *     "3 and number are not the same type"
 * >(refl);
 * </code>
 */
export function testNotEq<A, B, _doc = "">(p: NotEq<A, B>): NotEq<A, B> {
    return p;
}

/**
 * Test that the two types are disjoint (neither is assignable to the other).
 * The optional third type parameter may be used to document the purpose of the
 * test. For example:
 *
 * <code>
 * testDisjoint<
 *     undefined,
 *     number,
 *     "undefined and number are not assignable to each other"
 * >(refl);
 * testDisjoint<
 *     4,
 *     number,
 *     "this test will fail, since 4 is assignable to number"
 * >(refl);
 * </code>
 */
export function testDisjoint<A, B, _doc = "">(p: Disjoint<A, B>): Disjoint<A, B> {
    return p;
}

/**
 * Test that the first type is a subtype of (is assignable to) the second type.
 * This technically does not require a Leibniz proof of equality (generic
 * constraints could handle this), but it is included for consistency, as it
 * should always be properly instantiated if valid. The optional third type
 * parameter may be used to document the purpose of the test. For example:
 *
 * <code>
 * const x = 3;
 * testSub<
 *     typeof x,
 *     number,
 *     "const infers broad type of literal or narrower"
 * >(refl);
 * </code>
 */
export function testSub<A, B, _doc = "">(p: Sub<A, B>): Sub<A, B> {
    return p;
}

/**
 * Test that the first type is not a subtype of (is not assignable to) the
 * second type. This technically does not require a Leibniz proof of equality
 * (generic constraints could handle this), but it is included for consistency,
 * as it should always be properly instantiated if valid. The optional third
 * type parameter may be used to document the purpose of the test. For example:
 *
 * <code>
 * const x = 3;
 * testNotSub<
 *     typeof x,
 *     number,
 *     "this test will fail to compile"
 * >(refl);
 * </code>
 *
 * Note that this is not the same as being a strict supertype, as the types may
 * also be disjoint (incomparable).
 *
 * This is particularly useful in testing if code would not compile. For
 * example:
 *
 * <code>
 * function foo(x: string): string {
 *     return x;
 * }
 *
 * testNotSub<
 *     number,
 *     Parameters<typeof foo>[0]
 *     "assert that foo cannot take a number as an argument"
 * >
 * </code>
 */
export function testNotSub<A, B, _doc = "">(p: NotSub<A, B>): NotSub<A, B> {
    return p;
}

/**
 * Test that the first type is a strict subtype of (is assignable to, but is not
 * equal to) the second type. The optional third type parameter may be used to
 * document the purpose of the test. For example:
 *
 * <code>
 * const x = 3;
 * testStrictSub<
 *     typeof x,
 *     number,
 *     "const infers a strictly more specific type than number"
 * >(refl);
 * </code>
 */
export function testStrictSub<A, B, _doc = "">(p: StrictSub<A, B>): StrictSub<A, B> {
    return p;
}

/**
 * Test that the first type is not a strict subtype of (is equal to or not
 * assignable to) the second type. The optional third type parameter may be used
 * to document the purpose of the test. For example:
 *
 * <code>
 * const x = 3;
 * testNotStrictSub<
 *     typeof x,
 *     number,
 *     "const infers a strictly more specific type than number"
 * >(refl);
 * </code>
 *
 * Note that this is not the same as being a supertype, as the types may also be
 * disjoint (incomparable).
 */
export function testNotStrictSub<A, B, _doc = "">(p: NotStrictSub<A, B>): NotStrictSub<A, B> {
    return p;
}

/**
 * Test that the first type is a supertype of (is assignable from) the second
 * type. This technically does not require a Leibniz proof of equality (generic
 * constraints could handle this), but it is included for consistency, as it
 * should always be properly instantiated if valid. The optional third type
 * parameter may be used to document the purpose of the test. For example:
 *
 * <code>
 * let x = 4;
 * testSuper<
 *     typeof x,
 *     4,
 *     "let infers a literal type or broader"
 * >(refl);
 * </code>
 */
export function testSuper<A, B, _doc = "">(p: Super<A, B>): Super<A, B> {
    return p;
}

/**
 * Test that the first type is not a supertype of (is not assignable from) the
 * second type. This technically does not require a Leibniz proof of equality
 * (generic constraints could handle this), but it is included for consistency,
 * as it should always be properly instantiated if valid. The optional third
 * type parameter may be used to document the purpose of the test. For example:
 *
 * <code>
 * let x = 4;
 * testStrictSuper<
 *     typeof x,
 *     4,
 *     "let infers a broader type than a literal type"
 * >(refl);
 * </code>
 *
 * Note that this is not the same as being a strict subtype, as the types may
 * also be disjoint (incomparable).
 */
export function testNotSuper<A, B, _doc = "">(p: NotSuper<A, B>): NotSuper<A, B> {
    return p;
}

/**
 * Test that the first type is a strict supertype of (is assignable from, but
 * not equal to) the second type. The optional third type parameter may be used
 * to document the purpose of the test. For example:
 *
 * <code>
 * let x = 4;
 * testStrictSuper<
 *     typeof x,
 *     4,
 *     "let infers a broader type than a literal type"
 * >(refl);
 * </code>
 */
export function testStrictSuper<A, B, _doc = "">(p: StrictSuper<A, B>): StrictSuper<A, B> {
    return p;
}

/**
 * Test that the first type is not a strict supertype of (is equal to or not
 * assignable from) the second type. The optional third type parameter may be
 * used to document the purpose of the test. For example:
 *
 * <code>
 * let x = 4;
 * testStrictSuper<
 *     typeof x,
 *     4,
 *     "let infers a broader type than a literal type"
 * >(refl);
 * </code>
 *
 * Note that this is not the same as being a subtype, as the types may also be
 * disjoint (incomparable).
 */
export function testNotStrictSuper<A, B, _doc = "">(p: NotStrictSuper<A, B>): NotStrictSuper<A, B> {
    return p;
}

