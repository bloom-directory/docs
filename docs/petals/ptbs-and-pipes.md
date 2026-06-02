# PTBs And Pipes

Petals are called through programmable transaction blocks. A PTB is an ordered
list of commands plus signer, gas, and expiry metadata.

## Command Shape

The main command kind is a petal call:

```text
Command::Move {
  petal: { path, hash },
  function,
  type_args,
  args,
}
```

Arguments can be:

- signer references;
- constants;
- object references;
- outputs from earlier commands;
- type arguments.

The validator checks that each command matches the target function declared in
the petal manifest. Constant arguments and return slots are canonical Bloom
values decoded against the manifest-declared `TypeTag`; object arguments are
object IDs plus access metadata.

## Endpoint Paths

The front door resolves endpoint paths by splitting at the final slash:

```text
/bloom/dex/pool/swap_exact_in
└──────────────┬──┘ └──────┬──────┘
          petal path      function
```

The chain resolves the petal path to a content hash, loads the manifest, and
finds the named function.

## Pipe Expressions

`bloom pipe` is CLI sugar over PTBs. A linear pipe connects each command's
primary output to the next command:

```sh
bloom pipe '/bloom/a/make 10 | /bloom/b/use @0'
```

Labels make larger plans clearer:

```sh
bloom pipe '/bloom/examples/counter/new 0 as c | /bloom/examples/counter/increment @c 5'
```

The grammar also accepts explicit references:

```text
@<cmd_idx>.<ret_idx>
@label
obj:<object-id>[@version]
signer:<index>
type:<type-tag>
key=value
```

## VFS Tx Sessions

The VFS front door exposes the same builder as files:

```text
tx/
  new
  <id>/
    cmd
    status
    signer
    gas-payer
    commit
    abort
```

Writing a command line to `tx/<id>/cmd` validates and appends it. Reading
`tx/<id>/commit` builds the same PTB that `bloom pipe` would build.

## Atomicity

The executor runs the PTB over a state snapshot. If any command fails, all
writes are discarded. This is the core property that makes multi-step petal
composition useful.

## Read-Only View Calls

For Ethereum-style reads, nodes expose `chain_view_call`. A view call executes
one or more `#[view]` petal functions against a committed snapshot, meters fuel,
returns typed JSON plus the raw manifest-declared return slots, and never
commits state.

Typed JSON is a projection of the same canonical value codec used by PTBs and
object payloads. For example, `u64` and `u128` are decimal strings, smaller
integers are JSON numbers, 32-byte values and `bytes` are lowercase hex strings,
vectors and sets are arrays, maps are arrays of `[key, value]` pairs, `Option`
uses `null` for `None`, and `Result` uses `{ "Ok": value }` or
`{ "Err": value }`.

Only functions marked `#[view]` in the petal manifest can be called this way.
The chain verifies view purity at deploy time by checking that the view export
cannot reach mutating host imports. At call time, the node validates the call in
read-only mode: no gas coin is required, object arguments are forced to
read-only borrows, and any produced writes, deletes, ownership changes, or
publish events reject the result.

### CLI Form

```sh
bloom chain view \
  --path /bloom/examples/hello \
  --function add \
  --arg 2 \
  --arg 40
```

For historical reads, add `--at-block <height>`. The height selector exists only
on the standalone view path; committed PTBs always execute against the current
block state.

Object reads use object JSON. If `version` is omitted, the node fills it from the
selected snapshot:

```sh
bloom chain view \
  --path /bloom/examples/counter \
  --function value \
  --arg '{"kind":"object","id":"<counter-object-id-hex>"}'
```

Generic functions take one `--type-arg` per type parameter. The CLI accepts
canonical TypeTag hex, labels such as `u64` or `vector<u64>`, and structured
TypeTag JSON:

```sh
bloom chain view \
  --path /bloom/core/fungible \
  --function value \
  --type-arg 'Token@<token-petal-hash>' \
  --arg '{"kind":"object","id":"<coin-object-id-hex>"}'
```

The same type argument can be written in RPC JSON form:

```json
{
  "concrete": {
    "petal_hash": "<token-petal-hash>",
    "type_name": "Token",
    "type_args": []
  }
}
```

### RPC Form

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "chain_view_call",
  "params": {
    "path": "/bloom/examples/counter",
    "function": "value",
    "args": [
      { "kind": "object", "id": "<counter-object-id-hex>" }
    ],
    "fuel_limit": 1000000
  }
}
```

The same call can be written with a `commands` array. Use this form when a view
needs outputs from earlier view commands:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "chain_view_call",
  "params": {
    "commands": [
      {
        "path": "/bloom/examples/hello",
        "function": "add",
        "args": [2, 40]
      },
      {
        "path": "/bloom/examples/hello",
        "function": "add",
        "args": [{ "use": { "cmd": 0, "ret": 0 } }, 8]
      }
    ]
  }
}
```

### DEX Examples

For view-marked DEX entry points, quote and reserve reads use the same surface.

Pure constant-product math can be called with ordinary JSON numbers:

```sh
bloom chain view \
  --path /bloom/dex/strategy/cpmm \
  --function cpmm_quote_preview \
  --arg 1000 \
  --arg 1000 \
  --arg 100 \
  --arg 30
```

Pool reserves are object reads:

```sh
bloom chain view \
  --path /bloom/dex/pool \
  --function reserves \
  --arg '{"kind":"object","id":"<pool-object-id-hex>"}'
```

Router quotes are generic over the token route:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "chain_view_call",
  "params": {
    "path": "/bloom/dex/router",
    "function": "quote_1hop",
    "type_args": [
      {
        "concrete": {
          "petal_hash": "<token-a-petal-hash>",
          "type_name": "TokenA",
          "type_args": []
        }
      },
      {
        "concrete": {
          "petal_hash": "<token-b-petal-hash>",
          "type_name": "TokenB",
          "type_args": []
        }
      }
    ],
    "args": [
      { "kind": "object", "id": "<pool-object-id-hex>" },
      "1000000000000000000"
    ],
    "at_block": 12345
  }
}
```
