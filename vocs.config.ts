import { defineConfig } from 'vocs/config'

const env = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> }
}).process?.env ?? {}

const siteUrl =
  env.CF_PAGES_BRANCH === 'master'
    ? 'https://docs.bloom.directory'
    : undefined

export default defineConfig({
  title: '/bloom | Documentation',
  description:
    'Documentation for Bloom users, integrators, and developers: agentic wallets, filesystem-first crypto workflows, and petals.',
  logoUrl: '/logo.svg',
  iconUrl: {
    light: '/favicon-options/bloom-mono-black.svg',
    dark: '/favicon-options/bloom-mono-white.svg',
  },
  ogImageUrl: siteUrl ? `${siteUrl}/og.png` : '/og.png',
  baseUrl: siteUrl,
  rootDir: 'src/pages',
  renderStrategy: 'full-static',
  socials: [
    { icon: 'github', link: 'https://github.com/bloom-directory/' },
    { icon: 'x', link: 'https://x.com/bloom_directory' },
    { icon: 'telegram', link: 'https://t.me/bloom_directory' },
  ],
  topNav: [
    { text: 'Website', link: 'https://bloom.directory' },
    { text: 'GitHub', link: 'https://github.com/bloom-directory/docs' },
  ],
  sidebar: [
    { text: 'Overview', link: '/' },
    {
      text: 'Use Bloom',
      items: [
        { text: 'Start here', link: '/use-bloom/start-here' },
        { text: 'Is Bloom for me?', link: '/use-bloom/is-this-for-me' },
        { text: 'Concepts', link: '/use-bloom/concepts' },
        { text: 'Quickstart', link: '/use-bloom/quickstart' },
        { text: 'Safety and approvals', link: '/use-bloom/safety-and-approvals' },
        { text: 'Policies', link: '/use-bloom/policies' },
        { text: 'Petals for users', link: '/use-bloom/petals-for-users' },
        { text: 'FAQ', link: '/use-bloom/faq' },
      ],
    },
    {
      text: 'Product model',
      items: [
        { text: 'What is Bloom?', link: '/introduction/what-is-bloom' },
        { text: 'Benefits', link: '/introduction/benefits' },
        { text: 'Core concepts', link: '/introduction/core-concepts' },
        { text: 'Demos', link: '/introduction/demos' },
      ],
    },
    {
      text: 'Integrators',
      items: [
        { text: 'Local build and mount', link: '/integrators/quickstart' },
        { text: 'Agent setup', link: '/integrators/agent-setup' },
        { text: 'Integrating Bloom', link: '/integrators/integrating' },
      ],
    },
    {
      text: 'Wallet reference',
      items: [
        { text: 'Filesystem guide', link: '/wallet/filesystem-guide' },
        { text: 'Wallets and transactions', link: '/wallet/wallets-and-transactions' },
        { text: 'Use cases', link: '/wallet/use-cases' },
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
