# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a security vulnerability within this application, please follow these steps:

1. **Do not** disclose the vulnerability publicly on GitHub issues.
2. Email the security details to [security@yourdomainhere.com](mailto:security@yourdomainhere.com).
3. Include a description of the vulnerability and steps to reproduce if possible.
4. Allow time for the vulnerability to be addressed before public disclosure.

We aim to respond to security reports within 48 hours and will work with you to understand and address the issue.

## Security Features Implemented

This application includes the following security features:

### Content Security Policy (CSP)
- Strict CSP rules to prevent XSS attacks
- CSP violation reporting to monitor potential attacks
- Frame-ancestors restrictions to prevent clickjacking

### Input Validation
- Server-side validation of all user inputs
- Content type validation for API responses
- URL and path parameter validation

### API Security
- Input sanitization for all API requests
- Protection against injection attacks
- Rate limiting to prevent abuse

### Authentication & Authorization
- Environment variable validation for authentication services
- Secure handling of tokens and sensitive data
- HTTPS enforcement in production

### Third-Party Integration Security
- Strict validation of third-party scripts (Giscus)
- Allowlisted origins and parameters
- Integrity checks when available

### Additional Protections
- HTTP security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- HSTS for secure transport enforcement
- Permissions policy restrictions

## Security Best Practices for Development

When contributing to this project, please follow these security best practices:

1. Never store sensitive information in the repository.
2. Use environment variables for all configuration.
3. Validate all user inputs, both on client and server side.
4. Keep dependencies updated and regularly check for vulnerabilities.
5. Follow the principle of least privilege when implementing new features.
6. Use safe DOM manipulation methods to prevent XSS vulnerabilities.
7. Sanitize and validate all dynamic content before rendering.

## Running Security Tests

This project includes automated security testing:

1. Run `npm audit` to check for known vulnerabilities in dependencies.
2. Run `npm run lint` to check for potential security issues in code.
3. Run `npm test` to execute the security test suite.

## Dependency Scanning

We regularly scan dependencies for vulnerabilities using:

1. GitHub Dependabot alerts
2. npm audit
3. OWASP Dependency Check

Please ensure your pull requests do not introduce vulnerable dependencies.
