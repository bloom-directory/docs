export default {
  fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/') {
      url.pathname = '/root.html'
      return env.DOCS_ASSETS.fetch(new Request(url, request))
    }

    if (url.pathname === '/CNAME') return env.DOCS_ASSETS.fetch(request)

    if (url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}index.html`
      return env.DOCS_ASSETS.fetch(new Request(url, request))
    }

    if (!url.pathname.split('/').at(-1)?.includes('.')) {
      url.pathname = `${url.pathname}/index.html`
      return env.DOCS_ASSETS.fetch(new Request(url, request))
    }

    return env.DOCS_ASSETS.fetch(request)
  },
}
