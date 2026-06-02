# Project Map

This map points from docs concepts to the Bloom source files that implement
them.

| Concept | Source files |
| --- | --- |
| Petal macro | `crates/bloom-resource-macros/src/petal.rs` |
| Object macro | `crates/bloom-resource-macros/src/object.rs` |
| Capability macro | `crates/bloom-resource-macros/src/capability.rs` |
| Guest runtime | `crates/bloom-resource/src/lib.rs` |
| Host wrappers | `crates/bloom-resource/src/host.rs` |
| Guest `BloomType` runtime | `crates/bloom-resource/src/resource.rs` |
| Canonical value codec | `crates/bloom-value/src/lib.rs` |
| Args/return ABI envelope | `crates/bloom-resource/src/abi.rs` |
| Manifest schema | `crates/bloom-petal-manifest/src/types.rs` |
| Manifest extraction | `crates/bloom-petal-manifest/src/extract.rs` |
| Object model | `crates/bloom-objects/src/` |
| PTB wire types | `crates/bloom-script/src/types.rs` |
| PTB validation | `crates/bloom-script/src/validator.rs` |
| Manifest-driven value validation | `crates/bloom-script/src/value_validation.rs` |
| PTB execution | `crates/bloom-script/src/executor.rs` |
| Pipe builder | `crates/bloom-ptb-builder/src/` |
| CLI pipe | `crates/bloom/src/commands/pipe.rs` |
| VFS tx sessions | `crates/bloom-vfs/src/tx_handler.rs` |
| Chain VM | `crates/bloom-petals/src/chain_vm.rs` |
| Chain deploy/submit | `crates/bloom-chain-node/src/petal_executor.rs` |
| Minimal generic petal | `examples/petal-identity/src/lib.rs` |
| Standard fungible petal | `crates/bloom-petal-fungible/src/lib.rs` |
| Capability example | `examples/petal-cap/src/lib.rs` |
| DEX example | `examples/petal-dex/` |
