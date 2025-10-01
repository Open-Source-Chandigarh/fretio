# Contributing to Fretio 🤝

First off, thank you for considering contributing to Fretio! It's people like you that make Fretio a great platform for students.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

1. **Node.js 18+** installed
2. **Git** configured with your GitHub account
3. **Code Editor** (VS Code recommended)
4. **Supabase Account** for testing database features

### Setup Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fretio.git
   cd fretio
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Coder-MayankSaini/fretio.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Recommended VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocompletion
- **TypeScript Vue Plugin (Volar)** - TypeScript support
- **Path Intellisense** - Path autocompletion

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Run type checking
npm run build
```

### 4. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines) and commit:

```bash
git add .
git commit -m "feat: add amazing new feature"
```

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

Go to GitHub and open a Pull Request from your fork to the main repository.

## 💻 Coding Standards

### TypeScript Guidelines

1. **Use TypeScript strictly**
   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
     email: string;
   }

   function getUser(id: string): User {
     // ...
   }

   // ❌ Bad
   function getUser(id: any): any {
     // ...
   }
   ```

2. **Avoid `any` type** - Use proper types or `unknown`
   ```typescript
   // ✅ Good
   const data: unknown = JSON.parse(response);
   if (isUser(data)) {
     // use data
   }

   // ❌ Bad
   const data: any = JSON.parse(response);
   ```

3. **Use interfaces for objects**
   ```typescript
   // ✅ Good
   interface ProductProps {
     title: string;
     price: number;
     inStock: boolean;
   }

   // ❌ Bad - using type for simple objects
   type ProductProps = {
     title: string;
     price: number;
   }
   ```

### React Component Guidelines

1. **Use functional components with hooks**
   ```typescript
   // ✅ Good
   export function ProductCard({ product }: ProductCardProps) {
     const [isLoading, setIsLoading] = useState(false);
     
     return <div>...</div>;
   }

   // ❌ Bad - class components
   class ProductCard extends React.Component {
     // ...
   }
   ```

2. **Destructure props**
   ```typescript
   // ✅ Good
   function ProductCard({ title, price, image }: ProductCardProps) {
     return <div>{title}</div>;
   }

   // ❌ Bad
   function ProductCard(props: ProductCardProps) {
     return <div>{props.title}</div>;
   }
   ```

3. **Use proper prop types**
   ```typescript
   interface ProductCardProps {
     product: Product;
     onSelect?: (id: string) => void;
     className?: string;
   }
   ```

4. **Extract complex logic to custom hooks**
   ```typescript
   // Custom hook
   function useProductData(productId: string) {
     const [product, setProduct] = useState<Product | null>(null);
     const [loading, setLoading] = useState(true);
     
     // ... fetch logic
     
     return { product, loading };
   }

   // Component
   function ProductDetail({ id }: Props) {
     const { product, loading } = useProductData(id);
     
     return <div>...</div>;
   }
   ```

### File Naming Conventions

- **Components**: PascalCase - `ProductCard.tsx`, `UserProfile.tsx`
- **Hooks**: camelCase with 'use' prefix - `useAuth.ts`, `useProducts.ts`
- **Utils**: camelCase - `formatDate.ts`, `validateEmail.ts`
- **Services**: camelCase - `notificationService.ts`, `authService.ts`
- **Types/Interfaces**: PascalCase - `User`, `Product`, `ProductFormData`

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── FeatureName.tsx # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom hooks
├── services/           # Business logic & API calls
├── contexts/           # React contexts
├── lib/                # Utility functions
└── integrations/       # External service integrations
```

### Import Order

Organize imports in this order:

```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal components
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';

// 3. Hooks
import { useAuth } from '@/hooks/useAuth';

// 4. Services and utilities
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';

// 5. Types
import type { Product } from '@/integrations/supabase/types';
```

### Tailwind CSS Guidelines

1. **Use utility classes** - Don't create custom CSS unless necessary
2. **Order classes logically** - Layout → Spacing → Typography → Colors → Effects
3. **Use consistent spacing** - Stick to the Tailwind spacing scale
4. **Responsive design** - Always consider mobile first

```typescript
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md md:flex-row md:gap-6">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>

// ❌ Bad
<div className="bg-white text-gray-900 flex flex-col rounded-lg p-6 gap-4 shadow-md font-bold">
  <h2 className="text-xl">Title</h2>
</div>
```

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
# Feature
feat(products): add product filtering by category

# Bug fix
fix(auth): resolve login redirect issue

# Documentation
docs(readme): update installation instructions

# Refactor
refactor(messages): simplify chat component logic

# Multiple files
feat(marketplace): add search and filter functionality
- Add search input component
- Implement filter dropdown
- Update product query logic
```

### Best Practices

1. **Use imperative mood** - "add" not "added" or "adds"
2. **Keep subject line under 50 characters**
3. **Capitalize subject line**
4. **Don't end subject line with a period**
5. **Separate subject from body with blank line**
6. **Explain what and why, not how**

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Code follows style guidelines
2. ✅ All tests pass
3. ✅ No TypeScript errors
4. ✅ Documentation updated (if needed)
5. ✅ Self-review of code completed
6. ✅ Descriptive commit messages

### PR Title Format

Follow the same convention as commit messages:

```
feat(products): add product filtering by category
fix(auth): resolve login redirect issue
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

1. **Automated checks** must pass (linting, tests)
2. **At least one review** from maintainers required
3. **Requested changes** must be addressed
4. **Maintainers** will merge once approved

### After Your PR is Merged

1. Delete your branch
2. Update your fork
3. Celebrate! 🎉

## 🧪 Testing Guidelines

### Writing Tests

1. **Test file location**: Next to the file being tested
   ```
   src/services/
   ├── notificationService.ts
   └── __tests__/
       └── notificationService.test.ts
   ```

2. **Test structure**: Use describe/it blocks
   ```typescript
   describe('notificationService', () => {
     describe('send', () => {
       it('should send notification successfully', async () => {
         // Arrange
         const notification = {
           userId: 'test-user',
           type: 'message',
           title: 'Test',
           message: 'Test message'
         };

         // Act
         const result = await notificationService.send(notification);

         // Assert
         expect(result.success).toBe(true);
       });
     });
   });
   ```

3. **Test coverage**: Aim for 80%+ on critical code

### Running Tests

```bash
# Watch mode (recommended during development)
npm run test

# Run once
npm run test:run

# With coverage
npm run test:coverage

# With UI
npm run test:ui
```

## 🐛 Bug Reports

### Before Submitting

1. **Check existing issues** - Your bug might already be reported
2. **Try latest version** - Bug might be fixed in latest version
3. **Reproduce in clean environment** - Ensure it's not a local issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g. Windows 11, macOS 14]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node version: [e.g. 18.17.0]
- App version: [e.g. 1.2.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Before Submitting

1. **Check existing issues** - Feature might already be requested
2. **Consider scope** - Is this aligned with project goals?
3. **Think about alternatives** - Are there other solutions?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
Clear description of desired functionality

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, or other relevant information
```

## 📚 Documentation

### What to Document

- **New features** - How to use them
- **API changes** - Breaking changes, deprecations
- **Setup steps** - New dependencies or configuration
- **Complex logic** - Why certain decisions were made

### Documentation Style

1. **Be clear and concise**
2. **Use code examples**
3. **Include screenshots for UI changes**
4. **Keep README.md up to date**
5. **Add JSDoc comments for functions**

```typescript
/**
 * Sends a notification to a user
 * @param notification - The notification data
 * @returns Promise resolving to send result
 * @throws {Error} When user preferences disallow notification type
 */
async function sendNotification(notification: Notification): Promise<SendResult> {
  // implementation
}
```

## 🎯 Priority Areas

We're particularly interested in contributions in these areas:

1. **Testing** - Increasing test coverage
2. **Accessibility** - Making the app more accessible (a11y)
3. **Performance** - Optimizing load times and responsiveness
4. **Internationalization** - Adding i18n support
5. **Mobile Experience** - Improving mobile UI/UX
6. **Documentation** - Improving guides and examples

## ❓ Questions?

- **General questions**: Open a [Discussion](https://github.com/Coder-MayankSaini/fretio/discussions)
- **Bug reports**: Open an [Issue](https://github.com/Coder-MayankSaini/fretio/issues)
- **Security issues**: Email directly (don't create public issue)

## 🙏 Thank You!

Your contributions make Fretio better for everyone. We appreciate your time and effort!

---

Happy coding! 🚀
