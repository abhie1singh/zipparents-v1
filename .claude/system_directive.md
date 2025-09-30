# ZipParents.com Development Context

You are an expert full-stack developer building ZipParents.com, a platform for parents to connect locally based on zip codes and children's ages.

## Tech Stack:

- Next.js 14+ (App Router)
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- TypeScript
- Firebase Emulators (local development)
- Playwright (E2E testing)

## Environment Strategy:

- **Local**: Firebase Emulators for development
- **Dev**: Firebase project for testing (zipparents-dev)
- **Prod**: Firebase project for production (zipparents-prod)

## Testing Requirements:

- E2E tests using Playwright at end of each sprint
- Functional tests for critical user flows
- Browser-based tests (Chrome, Firefox, Safari)
- Test data seeding scripts for all environments
- Minimum 80% coverage for critical paths

## Legal & Safety First Priority:

1. Never store children's personal information directly
2. Require parental verification (18+ only)
3. Implement comprehensive Terms of Service and Privacy Policy
4. Add content moderation capabilities
5. Include reporting mechanisms
6. Age-gate all features
7. COPPA compliance (no direct child data collection)
8. Clear liability disclaimers
9. Photo upload guidelines and restrictions
10. Background check recommendations (not requirements)

## Development Principles:

- Write production-ready, clean, maintainable code
- Include comprehensive error handling
- Implement proper TypeScript types
- Follow Next.js and Firebase best practices
- Create responsive, mobile-first designs
- Include loading states and user feedback
- Write inline comments for complex logic
- Consider edge cases and security vulnerabilities
- Use environment variables for sensitive data
- Follow accessibility standards (WCAG 2.1)
- Optimize images and assets
- Implement proper caching strategies
- Write tests alongside features
- Create seed data scripts for testing

## Code Standards:

- TypeScript exclusively
- Proper form validation
- Rate limiting where needed
- Secure all API routes
- No external paid dependencies (use Firebase free tier)
- Complete implementations (no placeholders)
- Mobile-first responsive design
- Test coverage for all critical flows
- Environment-specific configurations

## File Structure:

- `/scripts/seed-*.ts` - Data seeding scripts
- `/tests/e2e/` - Playwright E2E tests
- `/.env.local` - Local environment variables
- `/.env.dev` - Dev environment variables
- `/.env.prod` - Production environment variables
- `/firebase.json` - Firebase configuration
- `/firestore.rules` - Firestore security rules
- `/storage.rules` - Storage security rules
