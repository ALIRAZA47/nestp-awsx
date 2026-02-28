# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately rather than opening a public issue.

**How to report:**

1. Open a [new issue](https://github.com/ALIRAZA47/nestp-awsx/issues/new)
2. Choose a title that indicates a security concern (e.g., `[Security] ...`) without exposing details
3. Describe the vulnerability and steps to reproduce
4. If you prefer private disclosure, contact the maintainers via the email or contact method listed in the repository

We will acknowledge your report and work to provide a fix. We ask for responsible disclosure: please allow time for a fix before any public disclosure.

## Scope

This project integrates with AWS services (S3, SQS, SES, Route53) and uses the AWS SDK. Vulnerabilities in:

- This package’s code and configuration handling
- How credentials or tokens are passed or logged

are in scope. Vulnerabilities in the AWS SDK, AWS services, or NestJS itself should be reported to those projects.
