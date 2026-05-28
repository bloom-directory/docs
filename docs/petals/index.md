# Petals

A petal is a Bloom application module compiled to WebAssembly. A deployed petal
is content-addressed by its wasm hash and bound to a human-readable path such as
`/bloom/core/fungible` or `/bloom/dex/pool`.

Petals are invoked through programmable transaction blocks, or PTBs. A PTB can
call multiple petal functions, pass outputs from one command into later
commands, transfer objects, split and merge coins, and commit or revert
atomically.

## What Petal Authors Write

Petal authors should start in their own Rust project, not inside the Bloom
monorepo. Today, depend on the Bloom repo by git URL, build your crate to wasm,
and use the Bloom CLI to deploy the resulting `.wasm`.

Petal authors write Rust crates that depend on the Bloom runtime and macros:

- `bloom-resource`: guest-side runtime types such as `Resource<T>`, `Coin<T>`,
  `Capability<T>`, `Signer`, `UID`, and host wrappers.
- `bloom-resource-macros`: `#[bloom::petal]`, `#[bloom::object]`,
  `#[bloom::capability]`, and `#[bloom::invariant]`.
- `bloom-objects`: object IDs, owners, access modes, and type tags.

Every public function inside a `#[bloom::petal]` module becomes a callable
entry point. The macro emits:

- one wasm export named `__petal_<function>`;
- a `bloom_petal_manifest_v0` custom section;
- an accessor for the encoded manifest bytes, used heavily by tests.

## What The Chain Uses

At deploy time, Bloom checks that the wasm contains a manifest section, that the
manifest path matches the deploy path, and that every manifest function has a
matching wasm export.

At call time, the PTB validator loads the manifest, checks argument kinds and
object access modes, then the executor runs the wasm under a deterministic
chain VM.
