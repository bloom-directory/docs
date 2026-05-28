# Testing Petals

Petal testing usually happens at three levels.

## 1. Host-Side Unit Tests

Keep payload codecs and math in normal Rust helpers. Test them without wasm.

The standard fungible petal uses this shape:

```text
pub mod ops {
  pub fn coin_payload(value: u128) -> Vec<u8> { ... }
  pub fn decode_coin_value(bytes: &[u8]) -> Result<u128, PetalError> { ... }
}
```

This gives fast tests for most bugs.

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
- Object payload codecs round-trip.
- Cap-gated functions reject missing or mismatched caps.
- Mutable functions update only the intended objects.
- Consuming functions cannot be double-spent in one PTB.
- Reverts leave state unchanged.

