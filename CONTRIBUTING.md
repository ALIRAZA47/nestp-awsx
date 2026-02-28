# Contributing to @nestp/awsx

Thanks for your interest in contributing. This document explains how to get started.

## Development Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nestp-awsx.git
   cd nestp-awsx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Making Changes

- Create a branch from `main` for your changes: `git checkout -b feat/your-feature` or `fix/your-fix`
- Keep commits focused and well-described
- Add or update tests for behavioral changes

## Submitting Changes

1. Push your branch and open a pull request against `main`
2. Ensure CI passes (tests run on every push and PR)
3. Fill in the PR template if one is provided
4. Wait for review; address feedback as needed

## Code Style

- TypeScript with standard formatting
- Tests live in `test/` grouped by category: `unit/`, `module/`, `services/`, `cli/`
- Run tests before pushing: `npm test`

## Reporting Bugs

Open an issue on GitHub. Include:

- Package version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior

## Suggesting Features

Open an issue describing the use case and proposed behavior. Discussion before implementation is welcome.
