# Quickstart

This guide shows the shape of a minimal Bloom-native petal, then a slightly more
involved object petal. The examples are intentionally small; the standard
library petals in the Bloom source tree are the production patterns to copy
once the mechanics are familiar.

## Prerequisites

You do not need to clone the Bloom monorepo to write a petal. A petal is just a
Rust library crate that depends on the Bloom petal SDK crates.

Install the wasm target:

```sh
rustup target add wasm32-unknown-unknown
```

You also need a Bloom CLI binary for deploys and PTB calls. The CLI does not
need to be in the same workspace as your petal. Public installation packaging is
still TBD; for now, use whichever Bloom binary your network/operator provides.

!!! note "Until the SDK crates are published"

    The intended public flow is `cargo add bloom-resource bloom-resource-macros
    bloom-objects`. If the crates are not on crates.io yet, use git dependencies
    from the Bloom repo instead. You should still create your petal in its own
    repo.

## Minimal Petal

Create a petal crate with dependencies on the macros and runtime:

```sh
cargo new bloom-petal-hello --lib
cd bloom-petal-hello
cargo add bloom-resource bloom-resource-macros
```

Your manifest should look like this:

```toml title="Cargo.toml"
[package]
name = "bloom-petal-hello"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
bloom-resource = "0.1"
bloom-resource-macros = "0.1"
```

If the crates are not published yet, use git dependencies:

```toml
[dependencies]
bloom-resource = { git = "https://github.com/bloom-directory/bloom.git" }
bloom-resource-macros = { git = "https://github.com/bloom-directory/bloom.git" }
```

Then define a petal module:

```rust title="src/lib.rs"
#![cfg_attr(target_arch = "wasm32", no_main)]

use bloom_resource_macros as bloom;

#[bloom::petal(path = "/bloom/examples/hello", version = "0.1.0")]
pub mod hello {
    pub fn version() -> u32 {
        1
    }

    pub fn add(a: u128, b: u128) -> u128 {
        a + b
    }
}
```

That is enough to produce:

- `__petal_version`;
- `__petal_add`;
- a `bloom_petal_manifest_v0` custom section declaring the path,
  version, arguments, and returns.

Build it:

```sh
cargo build --target wasm32-unknown-unknown --release
```

The wasm artifact will be under:

```text
target/wasm32-unknown-unknown/release/bloom_petal_hello.wasm
```

Deploying uses the Bloom chain CLI:

```sh
bloom chain deploy \
  target/wasm32-unknown-unknown/release/bloom_petal_hello.wasm \
  --wait
```

Once deployed, the petal path is resolved from the manifest. The callable
endpoint paths are:

```text
/bloom/examples/hello/version
/bloom/examples/hello/add
```

The real repo has this same minimal pattern in the CPMM strategy petal and a
generic version in the identity petal.

## Optional: Generic Dispatch

Generic petal functions emit one wasm export and receive concrete type
arguments at call time. This mirrors the existing identity example:

```rust
use bloom_resource::Coin;

pub fn identity<T>(c: Coin<T>) -> Coin<T> {
    c
}

pub fn echo_tag<T>() -> u128 {
    Coin::<T>::type_tag(0)
        .and_then(|tag| tag.encode_canonical().ok())
        .map(|bytes| bytes.len() as u128)
        .unwrap_or(0)
}
```

## Calling With `bloom pipe`

`bloom pipe` lowers endpoint calls into a PTB. For a real chain, you pass the
signer and gas-payer object:

```sh
bloom pipe \
  '/bloom/examples/hello/add 2 40' \
  --signer <32-byte-signer-hex> \
  --gas-payer <coin-object-id-hex>
```

Arguments are positional and encoded from the manifest signature. A literal
`2` in a `u128` slot becomes canonical big-endian `u128` bytes.

## A Slightly More Involved Petal: Counter

Objects are durable chain resources. A petal function receives an object as a
`Resource<T>` handle, reads the object payload through host imports, mutates it,
and returns normal values or new resources.

This counter example declares an object, creates a counter, increments it, and
reads it back.

```rust title="src/lib.rs"
#![cfg_attr(target_arch = "wasm32", no_main)]

use bloom_resource_macros as bloom;

#[bloom::petal(path = "/bloom/examples/counter", version = "0.1.0")]
pub mod counter {
    use bloom_objects::{ObjectId, TypeTag};
    use bloom_resource::{Resource, RuntimeHandle, UID, abi::RetWriter, host};
    use bloom_resource_macros::object;

    #[object(abilities = "key, store")]
    pub struct Counter {
        pub id: UID,
        pub value: u128,
    }

    pub fn new(initial: u128) -> Resource<Counter> {
        let handle = host::object_create(&counter_type_tag(), &counter_payload(initial))
            .expect("counter create failed");
        Resource::from_handle(handle)
    }

    pub fn increment(counter: &mut Resource<Counter>, by: u128) -> u128 {
        let bytes = host::object_read(counter.handle()).expect("counter read failed");
        let current = decode_value(&bytes);
        let next = current.checked_add(by).expect("counter overflow");
        host::object_mutate(counter.handle(), &rewrite_value(&bytes, next))
            .expect("counter mutate failed");
        next
    }

    pub fn value(counter: &Resource<Counter>) -> u128 {
        read_value(counter.handle())
    }

    fn counter_type_tag() -> TypeTag {
        TypeTag::Concrete {
            petal_hash: [0u8; 32],
            type_name: "Counter".to_string(),
            type_args: vec![],
        }
    }

    fn counter_payload(value: u128) -> Vec<u8> {
        let mut w = RetWriter::with_capacity(48);
        w.write_object_id(&ObjectId([0u8; 32]));
        w.write_u128(value);
        w.finish()
    }

    fn read_value(handle: RuntimeHandle) -> u128 {
        let bytes = host::object_read(handle).expect("counter read failed");
        decode_value(&bytes)
    }

    fn decode_value(bytes: &[u8]) -> u128 {
        let mut raw = [0u8; 16];
        raw.copy_from_slice(&bytes[32..48]);
        u128::from_be_bytes(raw)
    }

    fn rewrite_value(existing: &[u8], value: u128) -> Vec<u8> {
        let mut out = Vec::with_capacity(48);
        out.extend_from_slice(&existing[..32]);
        out.extend_from_slice(&value.to_be_bytes());
        out
    }
}
```

Add `bloom-objects` for this example:

```sh
cargo add bloom-objects
```

or, temporarily:

```toml
bloom-objects = { git = "https://github.com/bloom-directory/bloom.git" }
```

The PTB model makes this useful because one command can create a `Counter` and a
later command can use that output in the same atomic transaction:

```sh
bloom pipe \
  '/bloom/examples/counter/new 0 as c | /bloom/examples/counter/increment @c 5' \
  --signer <32-byte-signer-hex> \
  --gas-payer <coin-object-id-hex>
```

If any command fails, the whole PTB reverts.

## Next

Read [Authoring petals](authoring.md) for the macro surface and
[PTBs and pipes](ptbs-and-pipes.md) for how calls are assembled.
