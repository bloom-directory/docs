# Testing Petals

Petal testing usually happens at three levels.

## 1. Host-Side Unit Tests

Keep math and host-operation helpers in normal Rust modules. Test them without
wasm, but use the canonical `BloomType` codec for payload bytes.

The standard fungible petal uses this shape:

```rust
pub mod ops {
    use bloom_resource::{BloomType, Erased, PetalError};

    pub fn coin_payload(value: u128) -> Vec<u8> {
        crate::fungible::Coin::<Erased> { value, _phantom: Default::default() }
            .canonical_encode()
    }

    pub fn decode_coin_value(bytes: &[u8]) -> Result<u128, PetalError> {
        crate::fungible::Coin::<Erased>::canonical_decode(bytes)
            .map(|coin| coin.value)
            .map_err(|_| PetalError::InvalidArgs)
    }
}
```

Those helpers construct the declared Rust type and call
`canonical_encode()` / `canonical_decode()`; they do not hand-pack fields or
read fixed offsets. This gives fast tests for most bugs while keeping the
payload layout identical to the manifest-driven chain codec.

## 2. PTB Harness Tests

Use the in-process harness to build state, submit PTBs, and assert object
changes. These tests exercise validation, borrow-table behavior, command output
threading, ownership index updates, and atomic reverts.

The Bloom repo has harnesses under:

```text
crates/bloom-petal-it/
examples/petal-dex/tests/bloom-petal-dex-it/
```

## 3. Real Wasm Tests

For macro and chain-VM confidence, build the petal to wasm and execute the real
exports. This catches issues that pure host-side tests cannot catch:

- missing `__petal_<name>` exports;
- missing or malformed manifest custom sections;
- unsupported wasm imports;
- ABI mismatch between manifest and wasm export;
- canonical value codec mismatch between guest code and manifest validation;
- fuel or memory failures.

Example command:

```sh
cargo test -p bloom-petal-identity -- --ignored
```

Ignored tests are useful when they require `wasm32-unknown-unknown` or a slower
integration environment.

## What To Test For Every Petal

- Manifest contains the expected path and public functions.
- Every public function has the expected argument and return shape.
- Object, capability, and `BloomType` payloads round-trip through
  `canonical_encode()` / `canonical_decode()`.
- Malformed object payloads are rejected by `object.create` and
  `object.mutate`.
- Cap-gated functions reject missing or mismatched caps.
- Mutable functions update only the intended objects.
- Consuming functions cannot be double-spent in one PTB.
- Reverts leave state unchanged.
