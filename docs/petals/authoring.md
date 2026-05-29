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

For object-heavy petals, also add:

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

Plain generic payload fields are rejected unless they are phantom parameters or
wrapped in Bloom runtime resource types. This keeps object payload layout
explicit.

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
marker trait. A function that takes `&Capability<MintCap<T>>` is cap-gated.

## Function Arguments

Common argument types:

| Rust shape | PTB arg kind |
| --- | --- |
| `u8`, `u64`, `u128`, `bool`, bytes, strings | constant |
| `&Signer` | signer reference |
| `&Resource<T>` | read-only object |
| `&mut Resource<T>` | mutable object |
| `Resource<T>` | consumed object |
| `&Capability<T>` | capability proof |
| `Coin<T>` / `&mut Coin<T>` | fungible object handle |

Generic functions are called with runtime `TypeTag` values. The macro emits one
real export and binds the concrete type arguments for the duration of the call.

## Error Style

Petal entry points normally return the success type directly. Host wrappers
return `Result<T, PetalError>`, and the examples often use `expect(...)` at the
entry-point boundary. A panic or trap becomes a petal abort and reverts the PTB.

For testability, production petals often split logic into:

- a public `#[bloom::petal]` function with the simple ABI;
- an internal `ops` module with `Result`-returning helpers and payload codecs.
