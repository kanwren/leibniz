import { Eq } from "./Leibniz";

/**
 * Propositional type equality test. The third and fourth parameters are what
 * the type alias will evaluate to if the types are equal or not equal,
 * respectively.
 *
 * TODO: not correct!
 */
export type IfEq<A, B, Y = unknown, N = never> = ((x: A) => B) extends ((x: B) => A) ? ((x: B) => A) extends ((x: A) => B) ? Y : N : N;

/**
 * Propositional subtype test. The third and fourth parameters are what the type
 * alias will evaluate to if 'A' is or is not assignable to 'B', respectively.
 */
export type IfSub<A, B, Y = unknown, N = never> = A extends B ? Y : N;

/**
 * Propositional supertype test. The third and fourth parameters are what the
 * type alias will evaluate to if 'B' is or is not assignable to 'A',
 * respectively.
 */
export type IfSuper<A, B, Y = unknown, N = never> = B extends A ? Y : N;

/**
 * Propositional type disjointness test (A is not a subtype of B, and B is not a
 * subtype of A). The third and fourth parameters are what the type alias will
 * evaluate to if 'A' and 'B' are disjoint or not, respectively.
 */
export type IfDisjoint<A, B, Y = unknown, N = never> = A extends B ? N : B extends A ? N : Y;

