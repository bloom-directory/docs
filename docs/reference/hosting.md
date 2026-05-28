# Hosting

The docs are a static MkDocs site. The source files are Markdown under
`docs/`, and the site builds into `site/`.

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

Cloudflare Pages can host this site directly from the GitHub repository. Use:

```text
Production branch: master
Build command: pip install -r requirements.txt && mkdocs build --strict
Build output directory: site
Root directory: /
```

The repo includes `runtime.txt` to pin Python for Cloudflare Pages builds.

## Custom Domain

The repository includes:

```text
docs/CNAME
```

with:

```text
docs.bloom.directory
```

In Cloudflare Pages, add `docs.bloom.directory` as the custom domain for the
Pages project. Cloudflare will guide the DNS record setup.
