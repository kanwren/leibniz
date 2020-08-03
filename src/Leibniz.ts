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
 * Propositional type equality test. The third and fourth parameters are what
 * the type alias will evaluate to if the types are equal or not equal,
 * respectively.
 */
export type IfEq<A, B, Y = unknown, N = never> =
    ((x: A) => B) extends ((x: B) => A)
    ? ((x: B) => A) extends ((x: A) => B)
        ? Y
        : N
    : N;

/**
 * Symmetry of Leibniz equality; TypeScript will usually be smart enough to
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

