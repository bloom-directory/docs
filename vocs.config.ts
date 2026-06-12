import { defineConfig } from 'vocs/config'

export default defineConfig({
  title: 'Bloom Docs',
  description: 'Agentic Ethereum wallet documentation for Bloom.',
  logoUrl: '/bloom-mark.svg',
  iconUrl: '/bloom-mark.svg',
  rootDir: 'src/pages',
  renderStrategy: 'full-static',
  baseUrl: 'https://docs.bloom.directory',
  socials: [
    { icon: 'github', link: 'https://github.com/bloom-directory' },
    { icon: 'x', link: 'https://x.com/bloomdirectory' },
  ],
  topNav: [
    { text: 'Website', link: 'https://bloom.directory' },
    { text: 'GitHub', link: 'https://github.com/bloom-directory' },
  ],
  sidebar: [
    { text: 'Overview', link: '/' },
    {
      text: 'Introduction',
      items: [
        { text: 'What is Bloom?', link: '/introduction/what-is-bloom' },
        { text: 'Benefits', link: '/introduction/benefits' },
        { text: 'Core concepts', link: '/introduction/core-concepts' },
      ],
    },
    {
      text: 'Getting started',
      items: [
        { text: 'Quickstart', link: '/getting-started/quickstart' },
        { text: 'Agent setup', link: '/getting-started/agent-setup' },
      ],
    },
    {
      text: 'Agentic wallet',
      items: [
        { text: 'Filesystem guide', link: '/wallet/filesystem-guide' },
        { text: 'Wallets and transactions', link: '/wallet/wallets-and-transactions' },
        { text: 'DeFi intents', link: '/wallet/defi-intents' },
        { text: 'Watches and simulation', link: '/wallet/watches-and-simulation' },
        { text: 'Security model', link: '/wallet/security-model' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Technical architecture', link: '/reference/technical-architecture' },
        { text: 'Supported chains', link: '/reference/supported-chains' },
        { text: 'Project map', link: '/reference/project-map' },
        { text: 'Development', link: '/reference/development' },
        { text: 'Deployment', link: '/reference/deployment' },
        { text: 'Limitations', link: '/reference/limitations' },
      ],
    },
    {
      text: 'Petals',
      items: [
        { text: 'Overview', link: '/petals/overview' },
        { text: 'Quickstart', link: '/petals/quickstart' },
        { text: 'Model', link: '/petals/model' },
        { text: 'Authoring', link: '/petals/authoring' },
        { text: 'PTBs and pipes', link: '/petals/ptbs-and-pipes' },
        { text: 'Testing', link: '/petals/testing' },
      ],
    },
  ],
})
