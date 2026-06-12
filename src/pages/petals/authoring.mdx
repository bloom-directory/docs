# Authoring Petals

The petal authoring surface is a small Rust framework.

## Project Setup

Petals should be normal Rust crates. Do not clone the full Bloom source tree
just to write one.

Start with:

```sh
cargo new my-petal --lib
cd my-petal
```

Add the Bloom petal crates by git URL:

```toml title="Cargo.toml"
[dependencies]
bloom-resource = { git = "https://github.com/bloom-directory/bloom.git" }
bloom-resource-macros = { git = "https://github.com/bloom-directory/bloom.git" }
```

Set the library crate types:

```toml title="Cargo.toml"
[lib]
crate-type = ["cdylib", "rlib"]
```

Build only your petal:

```sh
cargo build --target wasm32-unknown-unknown --release
```

The Bloom CLI and chain are deployment tools. They do not need to be workspace
siblings of your petal crate.

Most petals do not need to depend on `bloom-objects` directly because
`bloom-resource` re-exports the author-facing `TypeTag` runtime type. Add
`bloom-objects` only when a petal or host-side test manually names lower-level
object-model types:

```toml
bloom-objects = { git = "https://github.com/bloom-directory/bloom.git" }
```

## `#[bloom::petal]`

Apply `#[bloom::petal]` to an inline module:

```rust
use bloom_resource_macros as bloom;

#[bloom::petal(path = "/bloom/examples/math", version = "0.1.0")]
pub mod math {
    pub fn add(a: u128, b: u128) -> u128 {
        a + b
    }
}
```

Every `pub fn` inside the module becomes part of the petal ABI. Private helpers
remain normal Rust helpers.

The macro records:

- module path;
- framework version;
- object declarations;
- capability declarations;
- plain `BloomType` data structs and enums;
- public function names, arguments, returns, view flags, signers, and required caps;
- invariants.

## `#[view]`

Add `#[view]` to a public petal function that reads state but does not create,
mutate, transfer, freeze, share, or delete objects.

```rust
#[bloom::petal(path = "/bloom/examples/math", version = "0.1.0")]
pub mod math {
    #[view]
    pub fn add(a: u128, b: u128) -> u128 {
        a + b
    }
}
```

View functions are discoverable in the manifest and can be called through
`bloom chain view` or the `chain_view_call` RPC method. Chain-mode deployment
statically checks each view export's call graph and rejects a view that can
reach mutating host imports. The read path also runs with read-only validation:
object arguments are borrowed read-only, no gas coin is required, and any
attempted state effect rejects the result.

`#[view]` is a bare marker and does not accept arguments.

## `#[bloom::object]`

Use `#[bloom::object]` for durable resource types.

```rust
#[bloom::object(abilities = "key, store", phantom = "T")]
pub struct Supply<T> {
    pub id: UID,
    pub total: u128,
    pub _phantom: core::marker::PhantomData<T>,
}
```

Recognized forms:

```rust
#[bloom::object]
#[bloom::object(abilities = "key, store")]
#[bloom::object(abilities = "key, store, copy, drop")]
#[bloom::object(no_abilities)]
#[bloom::object(phantom = "T, U")]
```

The macro also emits `BloomType` encoding and decoding for the object payload.
Petal code should create and mutate object bytes with
`T::canonical_encode()` / `T::canonical_decode()` instead of hand-written
payload codecs.

Plain generic payload fields are rejected unless they are phantom parameters or
wrapped in Bloom runtime resource types. This keeps object payload layout
explicit and manifest-resolvable.

## `#[bloom::capability]`

Capabilities are authority resources:

```rust
#[bloom::capability(phantom = "T")]
pub struct MintCap<T> {
    pub id: UID,
    pub _phantom: core::marker::PhantomData<T>,
}
```

The macro is sugar for a key/store/copy object declaration plus the runtime
marker trait. It participates in the same canonical payload codec as objects. A
function that takes `&Capability<MintCap<T>>` is cap-gated.

## `#[derive(BloomType)]`

Use `BloomType` for plain value structs and enums that are passed as constants,
stored inside object fields, or used inside collections.

```rust
#[derive(Clone, Debug, PartialEq, Eq, bloom::BloomType)]
pub struct Quote {
    pub amount_in: u128,
    pub amount_out: u128,
    pub route: Vec<String>,
}

#[derive(Clone, Debug, PartialEq, Eq, bloom::BloomType)]
pub enum Status {
    Empty,
    Filled { at_block: u64 },
    Error(String),
}
```

The derive emits a `BloomType` implementation and causes the petal manifest to
record the struct fields or enum variants. `#[bloom::object]` and
`#[bloom::capability]` build on the same encoding machinery.

## Built-In Value Types

The canonical type system has built-ins for scalars, bytes, text, collections,
tuples, and common enums. In Rust, the usual spellings are:

| Rust shape | Bloom type |
| --- | --- |
| `bool`, `u8`, `u16`, `u32`, `u64`, `u128` | same scalar |
| `[u8; 32]`, `ObjectId`, `Hash32`, `UID` | 32-byte scalar |
| `String` | `String` |
| `bloom_resource::Bytes` | `bytes` |
| `Vec<T>` | `vector<T>` |
| `(A, B, ...)` | `tuple<A, B, ...>` |
| `Option<T>` | `Option<T>` |
| `Result<T, E>` | `Result<T, E>` |
| `BTreeSet<T>` | `set<T>` |
| `BTreeMap<K, V>` | `map<K, V>` |

`Vec<u8>` is a `vector<u8>`. Use `bloom_resource::Bytes` when the schema should
be the distinct `bytes` type.

## Function Arguments

Common argument types:

| Rust shape | PTB arg kind |
| --- | --- |
| `BloomType` values, built-in scalars, bytes, strings | constant |
| `&Signer` | signer reference |
| `&Resource<T>` | read-only object |
| `&mut Resource<T>` | mutable object |
| `Resource<T>` | consumed object |
| `&Capability<T>` | capability proof |
| `Coin<T>` / `&mut Coin<T>` | fungible object handle |

Generic functions are called with runtime `TypeTag` values. The macro emits one
real export and binds the concrete type arguments for the duration of the call.
Petal-defined self types use a zero hash placeholder in macro-emitted source;
the chain resolves that placeholder to the defining petal's content hash.
Built-in types use Bloom's reserved built-in hash and do not use the self
placeholder.

## Error Style

Petal entry points normally return the success type directly. Host wrappers
return `Result<T, PetalError>`, and the examples often use `expect(...)` at the
entry-point boundary. A panic or trap becomes a petal abort and reverts the PTB.

For testability, production petals often split logic into:

- a public `#[bloom::petal]` function with the simple ABI;
- an internal `ops` module with `Result`-returning helpers that call the
  canonical `BloomType` codec.
