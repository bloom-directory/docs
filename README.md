# Bloom Docs

Markdown source for the Bloom developer docs site.

The site is built with MkDocs Material and is intended to deploy as a static
site on Cloudflare Pages at:

```text
https://docs.bloom.directory/
```

## Local Development

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

## Build

```sh
mkdocs build --strict
```

## Cloudflare Pages

Use these build settings:

```text
Production branch: master
Build command: pip install -r requirements.txt && mkdocs build --strict
Build output directory: site
Root directory: /
```

The repository includes `runtime.txt` to pin Python for Cloudflare Pages builds.

