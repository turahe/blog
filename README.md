# Wach Blog & Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg?style=for-the-badge)](LICENSE)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![GitHub Repositories](https://img.shields.io/badge/GitHub-Repositories-181717?style=for-the-badge&logo=github)](https://github.com/turahe)
[![Make](https://img.shields.io/badge/Make-Automation-FF6B6B?style=for-the-badge&logo=gnu)](https://www.gnu.org/software/make/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Yarn](https://img.shields.io/badge/Yarn-Package%20Manager-2C8EBB?style=for-the-badge&logo=yarn)](https://yarnpkg.com/)
[![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest)](https://jestjs.io/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Testing-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?style=for-the-badge&logo=eslint)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-Code%20Formatting-F7B93E?style=for-the-badge&logo=prettier)](https://prettier.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

A modern, fast, and SEO-optimized blog and portfolio website built with Next.js 15, Tailwind CSS 4, and Contentlayer. This project was forked and modified from [tailwind starter blog](https://github.com/timlrx/tailwind-nextjs-starter-blog).

![Wach Blog & Portfolio](public/static/images/screenshoot.png)

## ✨ Features

- ⚡ **Next.js 15** - Latest React framework with App Router
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 📝 **Contentlayer** - Type-safe content management
- 🔍 **SEO Optimized** - Built-in SEO features and metadata
- 🌙 **Dark Mode** - System, light, and dark theme support
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Performance** - Optimized for speed and Core Web Vitals
- 📊 **Analytics** - Support for Umami, Plausible, and Google Analytics
- 💬 **Comments** - Giscus, Utterances, and Disqus integration
- 🔎 **Search** - Kbar and Algolia search support
- 📧 **Newsletter** - Mailchimp, Buttondown, and other providers
- 🎯 **TypeScript** - Full TypeScript support
- 📄 **MDX Support** - Enhanced markdown with React components
- 🎵 **Sound Effects** - Interactive sound feedback
- 📈 **Reading Time** - Automatic reading time calculation
- 🏷️ **Tag System** - Organized content categorization
- 🐙 **GitHub Integration** - Live GitHub repositories page with caching
- 🔄 **Smart Caching** - 24-hour local JSON cache for GitHub data
- 🛠️ **Makefile Automation** - Comprehensive build and development tools
- 🔒 **Proprietary License** - Full intellectual property protection
- 🧪 **Comprehensive Testing** - Unit, integration, and E2E tests
- 🐳 **Docker Support** - Containerized development and deployment
- 📦 **Package Management** - Yarn with optimized dependency handling

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- Yarn (recommended) or npm
- Make (optional, for enhanced automation)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/turahe/blog.git
cd blog
```

2. Install dependencies:

```bash
yarn install
# or with Makefile
make install
```

**Note for Windows users:** You may need to run:

```powershell
$env:PWD = $(Get-Location).Path
```

### Development

Start the development server:

```bash
yarn dev
# or with Makefile
make dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The pages auto-update as you edit them with live reloading.

## 🛠️ Build & Deploy

### Build for Production

```bash
yarn build
# or with Makefile
make build
```

### Start Production Server

```bash
yarn serve
# or with Makefile
make serve
```

### Static Export

For static hosting services (GitHub Pages, S3, Firebase, etc.):

```bash
EXPORT=1 UNOPTIMIZED=1 yarn build
# or with Makefile
make build-static
```

**For URL base path deployment** (e.g., `https://example.org/myblog`):

```bash
EXPORT=1 UNOPTIMIZED=1 BASE_PATH=/myblog yarn build
```

## 🐙 GitHub Integration

### GitHub Repositories Page

The project includes a dedicated GitHub repositories page that displays your public repositories with:

- **Real-time Data** - Fetched directly from GitHub API
- **Smart Caching** - 24-hour local JSON cache for performance
- **Repository Cards** - Beautiful cards with stars, forks, languages, and topics
- **Live Demo Links** - Direct links to repository homepages
- **Language Indicators** - Color-coded programming language badges
- **Update Timestamps** - Last modification dates
- **Topic Tags** - Repository topics and categories

### Cache Management

Manage the GitHub repositories cache with these commands:

```bash
# Refresh the cache (fetch latest data)
make github-cache-refresh

# Clear the cache
make github-cache-clear

# Check cache status
make github-cache-status
```

## 🛠️ Makefile Automation

This project includes a comprehensive Makefile with 20+ commands for development automation:

### Development Commands

```bash
make dev          # Start development server
make build        # Build for production
make serve        # Start production server
make install      # Install dependencies
make clean        # Clean build artifacts
```

### Testing Commands

```bash
make test         # Run all tests
make test-watch   # Run tests in watch mode
make test-e2e     # Run E2E tests
make test-coverage # Run tests with coverage
```

### Code Quality

```bash
make lint         # Run ESLint
make lint-fix     # Fix linting issues
make format       # Format code with Prettier
make type-check   # Run TypeScript type checking
```

### License Management

```bash
make license-headers  # Add license headers to all files
make license-check    # Check which files have headers
```

### Docker Commands

```bash
make docker-build     # Build Docker image
make docker-run       # Run Docker container
make docker-compose-up # Start with Docker Compose
```

### GitHub Cache

```bash
make github-cache-refresh  # Refresh GitHub cache
make github-cache-clear    # Clear GitHub cache
make github-cache-status   # Check cache status
```

### Utility Commands

```bash
make help          # Show all available commands
make audit         # Run security audit
make outdated      # Check for outdated dependencies
make size          # Analyze bundle size
```

## 🎨 Customization

### Site Configuration

- `data/siteMetadata.js` - Main site information and metadata
- `data/authors/default.mdx` - Default author information
- `data/projectsData.ts` - Projects page data
- `data/headerNavLinks.ts` - Navigation links
- `data/logo.svg` - Site logo

### Content Management

- `data/blog/` - Blog posts (MDX format)
- `data/authors/` - Author profiles
- `public/static/` - Static assets (images, favicons, sounds)

### Styling

- `tailwind.config.js` - Tailwind CSS configuration
- `css/tailwind.css` - Custom CSS styles
- `css/prism.css` - Code block syntax highlighting
- `css/extra.css` - Additional custom styles

### Components

- `components/MDXComponents.tsx` - Custom MDX components
- `components/GitHubCard.tsx` - GitHub repository card component
- `layouts/` - Page layout templates
- `app/` - Next.js App Router pages

### Contentlayer Configuration

- `contentlayer.config.ts` - Content schema and MDX plugins

## 📝 Blog Posts

### Frontmatter

Posts use Hugo-style frontmatter with the following fields:

```yaml
---
title: 'Your Post Title'
date: '2024-01-01'
lastmod: '2024-01-15'
tags: ['next-js', 'tailwind', 'guide']
draft: false
summary: 'Brief description of your post'
images: ['/static/images/post-image.jpg']
authors: ['default']
layout: PostLayout
canonicalUrl: https://wach.id/blog/your-post-url
---
```

### Supported Fields

- `title` (required) - Post title
- `date` (required) - Publication date
- `tags` (optional) - Content tags
- `lastmod` (optional) - Last modification date
- `draft` (optional) - Draft status
- `summary` (optional) - Post summary
- `images` (optional) - Featured images
- `authors` (optional) - Author list
- `layout` (optional) - Layout template
- `canonicalUrl` (optional) - Canonical URL for SEO

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Deploy automatically

### Netlify

[Netlify](https://www.netlify.com/) provides excellent Next.js support:

1. Connect your repository
2. Build command: `yarn build`
3. Publish directory: `.next`

### GitHub Pages

Use the provided GitHub Actions workflow:

1. Enable GitHub Actions in your repository
2. Select "GitHub Actions" in Settings > Pages > Build and deployment > Source
3. The workflow will automatically build and deploy your site

### Static Hosting

For static hosting services:

```bash
EXPORT=1 UNOPTIMIZED=1 yarn build
```

Then deploy the generated `out` folder.

### Docker Deployment

```bash
# Build Docker image
make docker-build

# Run container
make docker-run

# Or use Docker Compose
make docker-compose-up
```

## 🔧 Configuration

### Analytics

Configure analytics in `data/siteMetadata.js`:

```javascript
analytics: {
  umamiAnalytics: {
    umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    src: process.env.NEXT_UMAMI_SRC,
  },
  // Other providers: plausibleAnalytics, simpleAnalytics, posthogAnalytics, googleAnalytics
}
```

### Comments

Set up comments in `data/siteMetadata.js`:

```javascript
comments: {
  provider: 'giscus', // giscus, utterances, disqus
  giscusConfig: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
    // ... other config
  }
}
```

### Newsletter

Configure newsletter in `data/siteMetadata.js`:

```javascript
newsletter: {
  provider: 'mailchimp', // mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
}
```

## 📦 Scripts

### Yarn Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn serve` - Start production server
- `yarn lint` - Run ESLint
- `yarn analyze` - Analyze bundle size
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn test:ci` - Run tests for CI environment
- `yarn test:e2e` - Run E2E tests with Playwright
- `yarn test:e2e:ui` - Run E2E tests with UI mode
- `yarn test:e2e:headed` - Run E2E tests in headed mode
- `yarn test:e2e:debug` - Run E2E tests in debug mode
- `yarn test:e2e:install` - Install Playwright browsers
- `yarn test:e2e:report` - Show E2E test report

### Makefile Commands

- `make help` - Show all available commands
- `make dev` - Start development server
- `make build` - Build for production
- `make serve` - Start production server
- `make install` - Install dependencies
- `make test` - Run all tests
- `make lint` - Run linting
- `make format` - Format code
- `make clean` - Clean build artifacts
- `make audit` - Run security audit
- `make docker-build` - Build Docker image
- `make github-cache-refresh` - Refresh GitHub cache

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **CI** (`ci.yml`) - Runs on every push and PR

  - Linting and type checking
  - Building the project
  - Security audits
  - Performance analysis

- **Deploy** (`deploy.yml`) - Deploys to Vercel on main branch

  - Automatic deployment to production
  - Requires Vercel secrets configuration

- **Static Export** (`static-export.yml`) - Creates static build

  - Exports static files for hosting
  - Deploys to GitHub Pages
  - Uploads build artifacts

- **Dependency Review** (`dependency-review.yml`) - Security checks

  - Reviews dependencies for vulnerabilities
  - Runs on every PR

- **CodeQL** (`codeql.yml`) - Advanced security analysis
  - Static code analysis
  - Vulnerability detection
  - Scheduled weekly scans

### Required Secrets

For deployment workflows, you'll need to configure these secrets in your GitHub repository:

#### Vercel Deployment

- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

#### How to get Vercel secrets:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Run `vercel link` in your project
4. Check `.vercel/project.json` for org and project IDs
5. Get token from [Vercel dashboard](https://vercel.com/account/tokens)

### Status Badges

Add these badges to your README to show CI status:

```markdown
![CI](https://github.com/turahe/blog/workflows/CI/badge.svg)
![Deploy](https://github.com/turahe/blog/workflows/Deploy/badge.svg)
![Static Export](https://github.com/turahe/blog/workflows/Static%20Export/badge.svg)
![Tests](https://github.com/turahe/blog/workflows/CI/badge.svg?branch=main&event=push)
```

## 🧪 Testing

This project includes comprehensive unit tests to ensure code quality and reliability.

### Test Structure

- `__tests__/utils/` - Utility function tests
- `__tests__/data/` - Data validation tests
- `__tests__/components/` - Component tests
- `__tests__/setup/` - Test utilities and setup

### Test Coverage

The test suite covers:

- **Data Validation** - Site metadata, navigation links, projects, and experience data
- **Utility Functions** - Date formatting, text truncation, URL validation, email validation
- **Component Testing** - React component rendering and interactions
- **Configuration** - Jest setup and mocking
- **E2E Testing** - Full user workflows and interactions
- **Performance Testing** - Page load times and responsiveness
- **Cross-browser Testing** - Chrome, Firefox, Safari, and mobile browsers

### Running Tests

```bash
# Run all tests
yarn test
# or
make test

# Run tests in watch mode
yarn test:watch
# or
make test-watch

# Run tests with coverage
yarn test:coverage
# or
make test-coverage

# Run tests for CI
yarn test:ci
```

### Test Configuration

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for testing
- **Coverage Threshold** - 70% minimum coverage required
- **Playwright** - E2E testing framework
- **Multiple Browsers** - Chrome, Firefox, Safari, and mobile browsers
- **Performance Testing** - Load time and responsiveness validation

### Writing Tests

Tests follow these conventions:

- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Validate data structures
- Test accessibility features

### E2E Testing with Playwright

The E2E test suite includes:

#### Test Categories:

- **Home Page Tests** - Page loading, navigation, and content verification
- **Blog Page Tests** - Post listing, pagination, and search functionality
- **Navigation Tests** - Cross-page navigation, mobile menu, and theme switching
- **Performance Tests** - Load times, responsiveness, and resource optimization

#### Browser Support:

- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)
- **Responsive**: Multiple viewport sizes

#### Features:

- **Parallel Execution** - Tests run in parallel for faster execution
- **Visual Testing** - Screenshots and videos on failure
- **Performance Monitoring** - Load time and resource usage tracking
- **Accessibility Testing** - Keyboard navigation and ARIA compliance
- **Mobile Testing** - Touch interactions and responsive design validation

## 🔒 License System

This project includes a comprehensive proprietary license system:

### License Files

- `LICENSE` - Full proprietary license text
- `LICENSE_HEADER.txt` - License header template
- `LICENSE_INFO.md` - Detailed license documentation

### License Management

```bash
# Add license headers to all source files
make license-headers

# Check which files have license headers
make license-check
```

### License Features

- **Copyright Protection** - Full copyright notices in all source files
- **Clear Restrictions** - No redistribution, modification, or commercial use
- **Contact Information** - Direct contact for licensing inquiries
- **Legal Compliance** - Proper disclaimer and warranty statements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under a Proprietary License - see the [LICENSE](LICENSE) file for details.

**Important:** This software is proprietary and confidential. All rights are reserved by Nur Wachid.
This project is provided for personal, non-commercial use only. Commercial use, redistribution,
modification, or derivative works require explicit written permission from the copyright holder.

For licensing inquiries, please contact:

- **Email:** wachid@outlook.com
- **Website:** https://wach.id
- **GitHub:** https://github.com/turahe

## 🙏 Acknowledgments

- Original template by [Timothy Lin](https://github.com/timlrx/tailwind-nextjs-starter-blog)
- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Contentlayer](https://www.contentlayer.dev/)
- GitHub integration and caching system
- Comprehensive Makefile automation
- Proprietary license system

---

**Built with ❤️ by [Nur Wachid](https://wach.id)**
