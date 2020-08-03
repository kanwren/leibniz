import { Eq, IfEq } from "./Leibniz";

// Derived Leibniz equality proof types for other forms of comparison. We really
// only need 'Eq', 'NotEq', 'Sub', and 'NotSub'; all other comparison types are
// derived from these.

/**
 * A Leibniz equality proof witnessing that 'A' and 'B' are not the same type.
 */
export type NotEq<A, B> = Eq<IfEq<A, B, true, false>, false>;

/**
 * A Leibniz equality proof witnessing that 'A' is a subtype of 'B'.
 */
export type Sub<A, B> = Eq<A extends B ? true : false, true>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a subtype of 'B'.
 */
export type NotSub<A, B> = Eq<A extends B ? true : false, false>;

/**
 * A Leibniz equality proof witnessing that 'A' is a supertype of 'B'.
 */
export type Super<A, B> = Sub<B, A>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a supertype of 'B'.
 */
export type NotSuper<A, B> = NotSub<B, A>;

/**
 * A Leibniz equality proof witnessing that 'A' is a strict subtype of 'B'.
 */
export type StrictSub<A, B> = Sub<A, B> & NotEq<A, B>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a strict subtype of 'B'.
 */
export type NotStrictSub<A, B> = Super<A, B> | Disjoint<A, B>;

/**
 * A Leibniz equality proof witnessing that 'A' is a strict supertype of 'B'.
 */
export type StrictSuper<A, B> = Super<A, B> & NotEq<A, B>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a strict supertype of
 * 'B'.
 */
export type NotStrictSuper<A, B> = Sub<A, B> | Disjoint<A, B>;

/**
 * A Leibniz equality proof witnessing that 'A' and 'B' are related.
 */
export type Related<A, B> = Sub<A, B> | Super<A, B>;

/**
 * A Leibniz equality proof witnessing that 'A' and 'B' are disjoint.
 */
export type Disjoint<A, B> = NotSub<A, B> & NotSuper<A, B>;

