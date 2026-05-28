# Petal Model

Bloom-native petals are deterministic wasm modules called by the chain executor.
They are not ordinary off-chain plugins and they do not have ambient access to
files, sockets, environment variables, or subprocesses.

## Core Pieces

| Piece | Meaning |
| --- | --- |
| Petal wasm | The compiled module stored by content hash. |
| Manifest | The `bloom_petal_manifest_v0` custom section emitted by `#[bloom::petal]`. |
| Path | Human-facing binding such as `/bloom/core/fungible`. |
| Object | Durable chain resource with an `ObjectId`, `TypeTag`, owner, version, and payload. |
| Capability | Copyable authority object used to gate privileged functions. |
| PTB | Programmable transaction block: an atomic plan of petal calls and built-in commands. |

## Objects

Objects are the durable state model. A petal declares object types with
`#[bloom::object]`, but petal code works with handles such as
`Resource<T>`, `Coin<T>`, or `Capability<T>`.

The chain owns the object table. Petals read and mutate objects through host
imports:

- `object.borrow`
- `object.read`
- `object.mutate`
- `object.create`
- `object.transfer`
- `object.delete`

Object payloads use the canonical Bloom codec: fixed-width big-endian integers,
length-prefixed bytes and strings, raw 32-byte IDs, and recursive `TypeTag`
encoding.

## Ownership And Linearity

A PTB borrow table tracks every object touched by a transaction. It enforces
access modes and prevents double-use of linear values. This is why a PTB can
compose several petal calls without copying or losing ownership of resources.

The common access modes are:

- read-only object borrow;
- mutable object borrow;
- consume/move object borrow.

Returned objects are represented as object IDs in command outputs so later PTB
commands can refer to them with `Use` references.

## Capabilities

Capabilities are ordinary objects with special meaning. A function can require a
capability argument:

```rust
pub fn mint<T>(
    _cap: &Capability<MintCap<T>>,
    supply: &mut Resource<Supply<T>>,
    amount: u128,
) -> Coin<T>
```

The runtime checks that the caller holds a matching capability object. This
keeps privileged actions explicit and composable.

## Deterministic Chain VM

Chain-mode petals run in a deterministic Wasmtime engine with fuel metering,
bounded memory, no threads, no WASI filesystem, and an allow-list of Bloom host
imports. Reverts discard the PTB snapshot; successful execution commits the
write set.

