/**
 * Leibniz equality of two types. A value of this type is a proof that the types
 * are equal. This is useful as a witness in situations where the compiler needs
 * extra help to figure out that two types are equal. If the compiler can figure
 * out that two types 'A' and 'B' are equal, then simply using 'refl' should
 * instantiate an 'Eq<A, B>'. Where necessary, Leibniz proofs may be manipulated
 * by other functions exported from this module.
 */
export type Eq<A, B> = ((x: A) => B) & ((x: B) => A);

/**
 * Symmetry of Leibniz equality; TypeScript will _usualy_ be smart enough to
 * figure out the symmetry without this, but not always.
 */
export function sym<A, B>(p: Eq<A, B>): Eq<B, A> {
    return p;
}

/**
 * Transitivity of Leibniz equality
 */
export function trans<A, B, C>(_1: Eq<A, B>, _2: Eq<B, C>): Eq<A, C> {
    return refl as any; // this function is true, but can't be written
}

/**
 * Substitution over the first parameter
 */
export function sub1<A, B, C>(_1: Eq<A, B>, _2: Eq<A, C>): Eq<C, B> {
    return sym(trans(sym(_1), _2));
}

/**
 * Substitution over the second parameter (equivalent to 'trans', but could be
 * used for conveying intention)
 */
export function sub2<A, B, C>(_1: Eq<A, B>, _2: Eq<B, C>): Eq<A, C> {
    return trans(_1, _2);
}

/**
 * Reflexivity of Leibniz equality. Equivalent to the identity function.
 * Effectively has the type 'forall A. Eq<A, A>'
 */
export function refl<T>(x: T): T {
    return x;
}

/**
 * Safely cast a value to an equivalent type given a Leibniz equality proof
 */
export function cast<A, B>(p: Eq<A, B>): (x: A) => B {
    return p;
}

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
 * Test that the first type is a subtype (is assignable to) the second type.
 * Does not require a Leibniz proof of equality. The optional third type
 * parameter may be used to document the purpose of the test. For example:
 *
 * <code>
 * const x = 3;
 * testSub<
 *     typeof x,
 *     number,
 *     "const infers broad type of literal or narrower"
 * >
 * </code>
 */
export function testSub<_ extends B, B, _doc = "">(): void {}

/**
 * Test that the first type is a supertype (is assignable from) the second type.
 * Does not require a Leibniz proof of equality. The optional third type
 * parameter may be used to document the purpose of the test.
 */
export function testSuper<A, _ extends A, _doc = "">(): void {}

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

