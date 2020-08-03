import { Eq } from "./Leibniz";
import { IfEq, IfSub, IfSuper, IfDisjoint } from "./Propositions";

// Proofs witnessing other forms of type comparison

/**
 * A Leibniz equality proof witnessing that 'A' and 'B' are not the same type.
 */
export type NotEq<A, B> = Eq<IfEq<A, B, true, false>, false>;

/**
 * A Leibniz equality proof witnessing that 'A' is a subtype of 'B'.
 */
export type Sub<A, B> = Eq<IfSub<A, B, true, false>, true>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a subtype of 'B'.
 */
export type NotSub<A, B> = Eq<IfSub<A, B, true, false>, false>;

/**
 * A Leibniz equality proof witnessing that 'A' is a strict subtype of 'B'.
 */
export type StrictSub<A, B> = Eq<IfSub<A, B, IfEq<A, B, false, true>, false>, true>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a strict subtype of 'B'.
 */
export type NotStrictSub<A, B> = Eq<IfSub<A, B, IfEq<A, B, false, true>, false>, false>;

/**
 * A Leibniz equality proof witnessing that 'A' is a supertype of 'B'.
 */
export type Super<A, B> = Eq<IfSuper<A, B, true, false>, true>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a supertype of 'B'.
 */
export type NotSuper<A, B> = Eq<IfSuper<A, B, true, false>, false>;

/**
 * A Leibniz equality proof witnessing that 'A' is a strict supertype of 'B'.
 */
export type StrictSuper<A, B> = Eq<IfSuper<A, B, IfEq<A, B, false, true>, false>, true>;

/**
 * A Leibniz equality proof witnessing that 'A' is not a strict supertype of 'B'.
 */
export type NotStrictSuper<A, B> = Eq<IfSuper<A, B, IfEq<A, B, false, true>, false>, false>;

/**
 * A Leibniz equality proof witnessing that 'A' and 'B' are disjoint.
 */
export type Disjoint<A, B> = Eq<IfDisjoint<A, B, true, false>, true>;

