const assert = (expr, msg = "") => {
  if (expr) {
    return;
  }

  throw new Error(`AssertionError: ${msg}`);
};

// Identity combinator
// I := 𝝺a.a
// In Haskell it is called the id function
const I = a => a;

// 𝝺a.b -> lambda abstraction
// 𝝺 -> function signifier
// a -> parameter variable
// b -> return expression
//
//
// Applications
//
// Function application: f a === f(a) (a space means the
// function is applied to its argument a)
//
// f a b === f(a)(b) -> functions are curried
// f (a b) === f(a(b))
//
//
// Abstractions
//
// 𝝺a.b === a => b
// 𝝺a.b x === a => b(x)
// (𝝺a.b) x === (a => b)(x)
// 𝝺a.𝝺b.a === a => b => a
//
//
// ß-Reduction -> ß-normal form ("function evaluation")
//
//
// Mockingbird combinator
// (self-application combinator)
// M := 𝝺f.ff
const M = f => f(f);

// M(I) === I(I)
//          I(I) === I
assert("M(I) === I", M(I) === I);

// Abstractions
// 𝝺a.𝝺b.𝝺c.b = 𝝺abc.b (curried functions)
//
// Kestrel combinator
// K := 𝝺ab.a
// In Haskell it is called the const function
const K = a => _ => a;

assert("K(I)(M) === I", K(I)(M) === I);
assert("K(K)(M) === K", K(K)(M) === K);

// K(I)(x)(y) === I(y)
//                I(y) === y
//
// So, K(I)(x)(y) === y (deriving the Kite combinator)
//
// Kite combinator
// KI := 𝝺ab.b
const KI = _ => b => b;

assert("KI(M)(I) === I", KI(M)(I) === I);
assert("KI(M)(I) === K(I)(M)", KI(M)(I) === K(I)(M));

// What is a combinator?
// A: A function with no free variables
//
// 𝝺b.b    combinator
// 𝝺b.a    not a combinator
// 𝝺ab.a   combinator
// 𝝺a.ab   not a combinator
//
// Cardinal combinator
// C := 𝝺fab.fba
// In Haskell it is called the flip function
const C = f => a => b => f(b)(a);

assert("C(K)(I)(M) === M", C(K)(I)(M) === M);
assert("KI(I)(M) === M", KI(I)(M) === M);

// Lambda Calculus <-> Turing Machines
//
// Church encodings: booleans
// result := func exp1 exp2
const T = K;
const F = KI;

// Not
// Not := 𝝺p.pFT (C)
const Not = p => p(F)(T);
assert("Not(T) === F", Not(T) === F);
assert("Not(F) === T", Not(F) === T);
assert("Not(K) === KI", Not(K) === KI);
assert("Not(KI) === K", Not(KI) === K);
// "The flip of true is false"
assert(
  "C(T)('first')('second') === 'second'",
  C(T)("first")("second") === "second"
);
// "The flip of false is true"
assert(
  "C(F)('first')('second') === 'first'",
  C(F)("first")("second") === "first"
);

// Intentional equality vs extensional equality
//
// Extensional: for every input they generate the same output
//
//
// And
// And := 𝝺pq.pqF = 𝝺pq.pqp
const And = p => q => p(q)(p);
assert(And(T)(T) === T);
assert(And(T)(F) === F);
assert(And(F)(T) === F);
assert(And(F)(F) === F);

// Or
// Or := 𝝺pq.pTq = 𝝺pq.ppq = M*
const Or = p => q => p(p)(q);
assert(Or(T)(T) === T);
assert(Or(T)(F) === T);
assert(Or(F)(T) === T);
assert(Or(F)(F) === F);
assert(M(T)(T) === T);
assert(M(T)(F) === T);
assert(M(F)(T) === T);
assert(M(F)(F) === F);

// Boolean equality
// 𝝺pq.p(qTF)(qFT) = 𝝺pq.pq(Not q)
const Beq = p => q => p(q)(Not(q));
assert(Beq(T)(T) === T);
assert(Beq(T)(F) === F);
assert(Beq(F)(T) === F);
assert(Beq(F)(F) === T);

// Onde of De Morgan's laws
// ¬(P^Q) = (¬P) v (¬Q)
const DM1 = p => q => Beq(Not(And(p)(q)))(Or(Not(p))(Not(q)));

assert(DM1(T)(T) === T);
assert(DM1(T)(F) === T);
assert(DM1(F)(T) === T);
assert(DM1(F)(F) === T);
