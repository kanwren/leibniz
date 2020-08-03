# leibniz

[![Build Status](https://travis-ci.com/nprindle/leibniz.svg?branch=master)](https://travis-ci.com/nprindle/leibniz)

A small TypeScript framework for unit testing types using Leibniz equality.

* [Motivation](#motivation)
* [Usage](#usage)
    * [Leibniz equality](#leibniz-equality)
        * [Eq](#eq)
        * [Other relations](#other-relations)
    * [Writing tests](#writing-tests)
        * [Basic tests](#basic-tests)
        * [Relation tests](#relation-tests)
        * [Custom relation tests](#custom-relation-tests)
    * [Examples](#examples)
        * [Basic examples](#basic-examples)
        * [Testing for properties](#testing-for-properties)
        * [Safe JSON encoding](#safe-json-encoding)

## Motivation

Types are a very useful tool to ensure safety, especially for library designers.
However, if you're designing a library that works with complicated types, it's
possible that you can accidentally change your types in a way that makes your
types too broad, too narrow, or changes type inference. `leibniz` gives you a
framework to write tests to make sure that the code you expect to compile still
compiles, and the code that shouldn't compile still doesn't.

## Usage

### Leibniz equality

#### Eq

The most important type in `leibniz` is `Eq<A, B>`. A value of type `Eq<A, B>`
is a proof witnessing that two types `A` and `B` are equal; if you have a value
of type `Eq<A, B>`, then you know that `A` and `B` are the same type. Whenever
the compiler can figure out that two types are equal, you can simply use `refl`
(for "reflexive") to make an instance of `Eq` for those two types:

```ts
type A = number;
type B = { foo: number; }["foo"];

const proof: Eq<A, B> = refl;
```

Like other kinds of equality, Leibniz equality is reflexive, transitive, and
symmetric:

- `refl` proves reflexivity by making an `Eq<A, A>` for any type `A`
- `sym` can be used to turn an `Eq<A, B>` into an `Eq<B, A>`, though the
  compiler should normally figure this out for you
- `trans` can compose an `Eq<A, B>` and an `Eq<B, C>` into an `Eq<A, C>`
- The `sub1` and `sub2` functions can be used to substitute the first or second
  type using another equality

Interacting with these proofs is almost never necessary, but if the compiler has
trouble figuring out proofs, you can use the proofs from previous tests to help
it out. Usually, you will only have to write `refl`, and the compiler will do
most of the heavy lifting for you.

#### Other relations

There are many types derived from `Eq` representing other type relationship
proofs:

- `NotEq<A, B>`: `A` is not the same type as `B`
- `Sub<A, B>`: `A` is a subtype of `B`
- `NotSub<A, B>`: `A` is not a subtype of `B`
- `StrictSub<A, B>`: `A` is a strict subtype of `B` (`A` is a subtype, and is
  not the same type as `B`)
- `NotStrictSub<A, B>`: `A` is not a strict subtype of `B`
- `Super<A, B>`: `A` is a supertype of `B`
- `NotSuper<A, B>`: `A` is not a supertype of `B`
- `StrictSuper<A, B>`: `A` is a strict supertype of `B`
- `NotStrictSuper<A, B>`: `A` is not a strict supertype of `B`
- `Related<A, B>`: `A` is related to `B` (one is assignable to the other)
- `Disjoint<A, B>`: `A` and `B` are disjoint (neither is assignable to the
  other)

Most of these are derived types that can be composed from more basic
relationships. For example:

```ts
type StrictSub<A, B> = Sub<A, B> & NotEq<A, B>;
```

All of these should still be able to be instantiated with only a single `refl`.

### Writing tests

`leibniz` tests are written using the `test` family of functions. If your tests
compile, then all `leibniz` tests passed. If your tests do not compile, then one
of your tests has failed.

If you wish, you can plug a no-op success into your preferred testing framework
so it logs that your `leibniz` tests passed:

```ts
import "mocha";
import { testEq, refl } from "@nprindle/leibniz";

testEq<number, number, "sanity check">(refl);

describe("types", () => {
    it("should compile", () => {});
});
```

#### Basic tests

This simplest function in `leibniz` is `test`, which simply makes sure that an
expression or block of code compiles. It is used like so:

```ts
test(() => ...);

// optionally, add a description of the test
test<"...">(() => ...);
```

For example:

```ts
// compiles and passes
test<"strings can be appended">(() => {
    const x = "foo";
    const y = "bar";
    return x + y;
});

// fails to compile
test<"strings can be multiplied">(() => {
    const x = "foo";
    const y = "bar";
    return x * y;
});
```

To group together multiple expressions, you can simply provide an array literal
or object literal:

```ts
// combining cases in an array
test<"these function calls all compile">(() => [
    foo(3),
    bar("test"),
    baz(foo),
]);

// use an object to name the cases
test<"these function calls compile too">(() => {
    check1: foo(7),
    check2: bar("quux"),
    check3: baz(bar),
});
```

The `test` function is actually very boring; since it only needs to check that
your code compiles, it's just a no-op; the code in the block is never actually
run.

#### Relation tests

`leibniz` provides many functions to test the relationship between types. It
provides a function for every provided relation proof type (see [Other
relations](#other-relations)). Each function expects a single proof that the
relation holds, though just passing `refl` almost always works.

Here's an example of the most basic relationship test function, `testEq`:

```ts
testEq<
    number,
    number,
    "sanity check that 'number' is equal to 'number'"
>(refl);
```

Each test function takes two type parameters, the types to compare. They may
additionally take an optional third parameter, usually a literal string type
that can serve as a description of what the test is checking. If no description
is provided, it will default to an empty description.

The provided relation tests are:

- `testEq`
- `testNotEq`
- `testSub`
- `testNotSub`
- `testStrictSub`
- `testNotStrictSub`
- `testSuper`
- `testNotSuper`
- `testStrictSuper`
- `testRelated`
- `testDisjoint`

#### Custom relation tests

If you need a relation test that is not provided by default, you can test a
custom relation using the `testRel` function. Since the relation proof types can
compose using `&` and `|`, we can create more complicated relationships out of
them.

For example, let's say that we want to test that two types are related (one is a
subtype of the other), but not equal. That is, we need a `Related<A, B>` proof,
but also a `NotEq<A, B>` proof. We could write this as follows:

```ts
testRel<
    Related<A, B> & NotEq<A, B>,
    "check that A and B are related but not the same"
>(refl);
```

The `testRel` function is powerful; you can use it to define all of the other
provided testing functions. For example:

```ts
testRel<
    Sub<A, B> | Super<A, B>,
    "same as testRelated<A, B>"
>(refl);

testRel<
    Sub<A, B> & NotEq<A, B>
    "same as testStrictSub<A, B>"
>(refl);
```

### Examples

#### Basic examples

Let's write some basic sanity checks to show how `leibniz` tests work:

```ts
testEq<
    string,
    string,
    "a type should be equal to itself"
>(refl);

testSub<
    number,
    number,
    "a type should be a subtype of itself"
>(refl);

// This will fail to compile
testSub<
    number,
    3,
    "number is not a subtype of a literal type"
>(refl);

testEq<
    number[],
    { foo: number }["foo"][],
    "equality of derived compound types"
>(refl);
```

One useful application of type testing is to check that your type inference
behaves the way you expect it to. For example:

```ts
let x = 3;
testEq<typeof x, number>(refl);
// passes (compiles without error)

const y = 3;
testEq<typeof y, number>(refl);
// fails! const actually infers the narrower literal type '3'

const z = 3;
testEq<typeof z, 3>(refl);
// passes
```

If you're writing an API with complicated inferred types, it's essential to make
sure that types are inferred the way you expect them to be.

### Testing for properties

As a more practical example, let's say that we have a component `C`, which is an
object with certain properties. Let's say that the shape of `C` changes
frequently, but the users of our API know that it should always be an object
with a `url: string` property. We want to test that no matter what changes we
make to `C`, we always have that property. To check that the type has this
property, we can test that intersecting the keys of `C` with `{ url: string; }`
gives us back `{ url: string; }`:

```ts
test<"C tests">(() => {
    testSub<
        C,
        object,
        "C should always be an object"
    >(refl);

    testEq<
        C | { url: string; }, // '|' intersects the keys of two types
        { url: string; },
        "C should always have a 'url: string' property"
    >(refl);
});
```

We can even abstract this into a separate helper test function:

```ts
// Takes a proof of the above form and simply returns it
function testHasProps<
    T extends object,
    P extends object,
    _doc = ""
>(proof: Eq<T | P, P>): Eq<T | P, P> {
    return proof;
}

testHasProps<
    C,
    { url: string; },
    "C should always have a 'url: string' property"
>(refl);
```

Now, if we make a mistake (like change the shape of `C` to have a `URL: string`
instead), our tests will catch it!

#### Safe JSON encoding

Let's say we define a function `jsonEncode` which wraps `JSON.stringify`. Since
`JSON.stringify` takes an `any`, it has unxpected behavior when called on data
that can't be represented in JSON. For example, `JSON.stringify([undefined])` is
`"[null]"`!

The input type of our `jsonEncode` will be safe; it can only stringify data
which can be represented in JSON:

```ts
// Implementing this type is left as an exercise for the reader
type JsonValue = ...;

function jsonEncode(data: JsonValue): string {
    return JSON.stringify(data);
}
```

We want to write some tests to make sure that it would compile if given valid
JSON inputs, but wouldn't compile if given an invalid JSON input. A JSON value
may be a string, a boolean, a number, null, an array of JSON values, or an
object with string keys and JSON values (that may also be undefined; the keys
will simply be excluded when stringifying).

One approach is to write a basic `test` block to make sure that it accepts some
valid inputs:

```ts
test<"jsonEncode should accept valid JSON inputs">(() => [
    jsonEncode("foo"),
    jsonEncode(true),
    jsonEncode(3.14),
    jsonEncode(null),
    jsonEncode([]),
    jsonEncode({}),
    jsonEncode({ foo: undefined }),
]);
```

We could also directly verify that the types can be passed, by checking that the
types are valid subtypes of the function's parameter. We can find the type of
the argument to `jsonEncode` with `Parameters<typeof jsonEncode>[0]`:

```ts
test<"jsonEncode should accept valid JSON inputs">(() => {
    type JsonEncodeParam = Parameters<typeof jsonEncode>[0];
    testSub<string, JsonEncodeParam>(refl);
    testSub<boolean, JsonEncodeParam>(refl);
    testSub<number, JsonEncodeParam>(refl);
    testSub<null, JsonEncodeParam>(refl);
    testSub<JsonValue[], JsonEncodeParam>(refl);
    testSub<Record<string, JsonValue | undefined>, JsonEncodeParam>(refl);
});
```

Now, we also want to make sure that `jsonEncode` does NOT accept invalid inputs
like `undefined` or `undefined[]`. To do this, we can check that these types are
not subtypes of the parameter type:

```ts
test<"jsonEncode should not accept invalid inputs">(() => {
    type JsonEncodeParam = Parameters<typeof jsonEncode>[0];
    testNotSub<
        undefined,
        JsonEncodeParam,
        "jsonEncode should not accept undefined"
    >(refl);
    testNotSub<
        undefined[],
        JsonEncodeParam,
        "jsonEncode should not accept undefined[]"
    >(refl);
});
```

Now, if we later incorrectly change the type of `JsonValue` to accept
`undefined`, our tests will fail to compile, and we can catch the error before
release! Note that in addition to making sure that certain code will compile,
`leibniz` can also be used to make sure that certain code _won't_ compile.

