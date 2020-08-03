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
    return refl as any; // TS isn't smart enough to figure this one out
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
 * Test that two types are equal. The third type parameter can be used to give a
 * name to the test. Usually, it suffices to pass 'refl' as the only argument;
 * this is needed to instantiate the impredicative type. For example:
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
export function testEq<A, B, _ = "">(p: Eq<A, B>): Eq<A, B> {
    return p;
}

/**
 * Curry a two-argument function. This can be useful when partially applying a
 * function to test that a given invocation does not compile.
 */
export function curry2<A, B, R>(f: (x: A, y: B) => R): (x: A) => (y: B) => R {
    return x => y => f(x, y);
}

/**
 * Flip the order of the first two arguments of a curried function. This can be
 * useful when partially applying a function to test that a given invocation
 * does not compile.
 */
export function flip<A, B, R>(f: (x: A) => (y: B) => R): (y: B) => (x: A) => R {
    return y => x => f(x)(y);
}

