# Bloom Docs

Bloom petals are WebAssembly modules that define application logic for the
Bloom chain.

This site is for developers who want to write, test, deploy, and call petals.
It focuses on the current Bloom-native chain-mode petal system: `#[bloom::petal]`
modules, object resources, capability resources, manifests, programmable
transaction blocks, and pipe-style invocation.

## Start Here

- [Quickstart](petals/quickstart.md): build a minimal petal and a small object
  petal.
- [Petal model](petals/model.md): the execution model, objects, ownership, and
  capabilities.
- [Authoring petals](petals/authoring.md): the Rust macros and runtime types
  that make up the authoring surface.
- [PTBs and pipes](petals/ptbs-and-pipes.md): how petals are called atomically.

## Status

These docs describe the implementation in the Bloom workspace currently under
active development. Historical design notes, audits, and plans should live in
the source repo as archive material, not as the main author path.

