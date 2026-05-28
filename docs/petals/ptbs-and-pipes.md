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
the petal manifest.

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

