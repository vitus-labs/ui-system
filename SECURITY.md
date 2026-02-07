# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, email **vit@bokisch.cz** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect an initial response within 48 hours. We will work with you to understand and address the issue before any public disclosure.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x | Yes |
| < 1.0 | No |

## Security Measures

This project includes the following security considerations:

- **Prototype pollution protection** — `set()` and `merge()` utilities in `@vitus-labs/core` block `__proto__`, `constructor`, and `prototype` keys
- **No `eval` or `Function` constructors** — no dynamic code execution
- **No server-side code** — all packages are client-side React libraries
- **Dependency auditing** — dependencies are regularly reviewed
