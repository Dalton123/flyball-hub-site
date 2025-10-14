# Coding Standards

This document outlines the coding standards for the Flyball Hub project. Our goal is to write **clean, DRY, reusable code that isn't overly complex**.

## Core Principles

### 1. DRY (Don't Repeat Yourself)
- Extract reusable logic into utilities, hooks, or components
- Use composition over duplication
- Create shared packages for cross-app functionality

### 2. Clean Code
- Write self-documenting code with clear, descriptive names
- Keep functions small and focused (single responsibility)
- Avoid deep nesting (max 3 levels)
- Prefer early returns to reduce complexity

### 3. Simple Over Clever
- Write code that's easy to understand and maintain
- Avoid premature optimization
- Use straightforward solutions unless complexity is justified

## TypeScript Standards

### Strict Typing
```typescript
// ✅ Good - Explicit types
interface HeroProps {
  title: string;
  badge?: string;
  buttons?: ButtonType[];
}

export function Hero({ title, badge, buttons }: HeroProps) {
  // ...
}

// ❌ Bad - Using any
function processData(data: any) {
  // ...
}
```

### Type Inference
- Let TypeScript infer types when obvious
- Explicitly type function parameters and returns
- Use generics for reusable type-safe components

```typescript
// ✅ Good - Inferred return type
function calculateTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - Explicit when needed
async function fetchUser(id: string): Promise<User | null> {
  // ...
}
```

### Avoid Type Assertions
```typescript
// ❌ Avoid
const user = data as User;

// ✅ Prefer type guards
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}
```

## React & Next.js Patterns

### Component Structure

#### Server Components by Default
```typescript
// ✅ Good - Server component (default)
export async function BlogList() {
  const posts = await fetchPosts();
  return <div>{/* ... */}</div>;
}
```

#### Client Components Only When Needed
```typescript
// ✅ Good - Only mark as client when using hooks/interactivity
"use client";

export function ModeToggle() {
  const [theme, setTheme] = useState<Theme>();
  // ...
}
```

### Component Organization
```
components/
├── elements/          # Small, reusable UI elements
│   ├── sanity-image.tsx
│   └── rich-text.tsx
├── sections/          # Page sections/blocks
│   ├── hero.tsx
│   └── feature-cards.tsx
└── [component].tsx    # Layout components (navbar, footer)
```

### Props & Composition
```typescript
// ✅ Good - Composable, typed props
interface SanityImageProps {
  image: SanityImageType;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}

// ✅ Good - Spread remaining props for flexibility
export function SanityImage({
  image,
  className,
  ...props
}: SanityImageProps) {
  return <Image {...props} className={cn("...", className)} />;
}
```

### Conditional Rendering
```typescript
// ✅ Good - Early return for cleaner code
export function Badge({ children }: { children?: React.ReactNode }) {
  if (!children) return null;

  return <span className="badge">{children}</span>;
}

// ❌ Bad - Deep nesting
export function Badge({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children && (
        <span className="badge">{children}</span>
      )}
    </>
  );
}
```

## File & Naming Conventions

### File Naming
- Components: `kebab-case.tsx` (e.g., `mode-toggle.tsx`)
- Utilities: `kebab-case.ts` (e.g., `utils.ts`)
- Types: `types.ts` or colocated with component
- Tests: `*.test.ts` or `*.spec.ts`

### Variable & Function Naming
```typescript
// ✅ Good - Clear, descriptive names
const isUserAuthenticated = checkAuth();
const formattedDate = formatDate(date);
function calculateShippingCost(items: CartItem[]): number {}

// ❌ Bad - Unclear abbreviations
const isAuth = chk();
const dt = fmt(d);
function calc(itms: any[]): number {}
```

### Component Naming
```typescript
// ✅ Good - PascalCase for components
export function HeroBlock() {}
export function FeatureCards() {}

// ✅ Good - Descriptive hook names
export function useIsMobile() {}
export function useSanityData() {}
```

## Import Organization

### Import Order
```typescript
// 1. External dependencies
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

// 2. Type imports
import type { PagebuilderType } from "@/types";

// 3. Internal components/utils
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";
```

### Use Absolute Paths
```typescript
// ✅ Good - Use @ alias
import { config } from "@/config";
import type { Post } from "@/types";

// ❌ Bad - Relative paths for app imports
import { config } from "../../config";
```

### Workspace Packages
```typescript
// ✅ Good - Use workspace packages
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
```

## Styling Standards

### Tailwind Classes
```typescript
// ✅ Good - Use cn() for conditional classes
import { cn } from "@workspace/ui/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />

// ✅ Good - Logical grouping with line breaks
<div className="
  grid items-center gap-8
  lg:grid-cols-2
  md:px-6
" />
```

### Responsive Design
```typescript
// ✅ Good - Mobile-first approach
<h1 className="text-4xl lg:text-6xl font-semibold">
  {title}
</h1>

<div className="w-full sm:w-auto md:w-1/2">
  {/* ... */}
</div>
```

## Sanity Integration

### Schema Organization
```
schemaTypes/
├── documents/         # Main document types
│   ├── blog.ts
│   └── page.ts
├── objects/           # Reusable objects
│   └── blocks/
└── definitions/       # Shared definitions
    └── custom-url.ts
```

### Query Optimization
```typescript
// ✅ Good - Only fetch needed fields
const query = `*[_type == "blog" && slug.current == $slug][0]{
  title,
  slug,
  publishedAt,
  "author": author->{name, image}
}`;

// ❌ Bad - Fetching everything
const query = `*[_type == "blog"]`;
```

### Type Generation
- Use Sanity's type generation: `sanity.types.ts`
- Keep types in sync with schemas
- Use generated types in components

## Performance Best Practices

### Image Optimization
```typescript
// ✅ Good - Proper image optimization
<SanityImage
  image={heroImage}
  width={800}
  height={600}
  loading="eager"        // For above-fold images
  fetchPriority="high"   // For LCP images
/>

// ✅ Good - Lazy load below-fold images
<SanityImage
  image={image}
  loading="lazy"
  width={400}
  height={300}
/>
```

### Code Splitting
```typescript
// ✅ Good - Dynamic imports for heavy components
const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### Bundle Size
- Avoid importing entire libraries when you only need parts
- Use tree-shakeable imports
- Check bundle size impact of new dependencies

```typescript
// ✅ Good
import { formatDate } from "date-fns/formatDate";

// ❌ Bad
import * as dateFns from "date-fns";
```

## Code Quality

### Linting & Formatting
- Run `pnpm lint` before committing
- Use `pnpm format` for consistent formatting
- Fix ESLint warnings, don't disable them without good reason

### Type Checking
```bash
# Run type checking across monorepo
pnpm check-types
```

### Error Handling
```typescript
// ✅ Good - Handle errors gracefully
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error("Failed to fetch data:", error);
  return null;
}

// ✅ Good - Validate external data
if (!value?.href || value.href === "#") {
  console.warn("Invalid link:", value);
  return <span>Link Broken</span>;
}
```

## Documentation

### JSDoc for Complex Logic
```typescript
/**
 * Parses rich text children to generate URL-safe slug
 * Used for generating anchor IDs from headings
 *
 * @param children - Array of portable text children
 * @returns URL-safe slug string
 */
export function parseChildrenToSlug(children: PortableTextChild[]): string {
  // ...
}
```

### README for Packages
- Each package should have a README
- Document installation, usage, and examples
- Keep package documentation up-to-date

### Comments
```typescript
// ✅ Good - Explain "why", not "what"
// Disable third-party cookies requirement for preview
// See: https://github.com/sanity-io/next-sanity/issues/123

// ❌ Bad - Obvious comments
// Loop through items
items.forEach(item => {
  // ...
});
```

## Testing Mindset

### Write Testable Code
- Keep functions pure when possible
- Avoid side effects in business logic
- Separate logic from presentation

```typescript
// ✅ Good - Testable utility
export function calculateDiscount(price: number, percentage: number): number {
  return price * (percentage / 100);
}

// ✅ Good - Testable component logic
export function useCartTotal(items: CartItem[]) {
  return useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
}
```

## Monorepo Best Practices

### Workspace Dependencies
```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*",
    "@workspace/typescript-config": "workspace:*"
  }
}
```

### Shared Configuration
- Use shared ESLint config: `@workspace/eslint-config`
- Use shared TypeScript config: `@workspace/typescript-config`
- Keep configs DRY across apps

### Turborepo
- Use `turbo dev` for parallel development
- Leverage caching for faster builds
- Define clear task dependencies in `turbo.json`

## Git & Version Control

### Commit Messages
```bash
# ✅ Good
feat: Add newsletter subscription component
fix: Resolve image loading issue in Safari
refactor: Extract table of contents logic to hook

# ❌ Bad
update stuff
fix bug
changes
```

### Branch Naming
```bash
feature/newsletter-component
fix/safari-image-loading
refactor/toc-extraction
```

## Common Patterns

### Custom Hooks
```typescript
// ✅ Good - Reusable logic in hooks
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
```

### Data Fetching
```typescript
// ✅ Good - Server-side data fetching
export async function BlogPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  if (!post) {
    notFound();
  }

  return <article>{/* ... */}</article>;
}
```

### Form Handling
```typescript
// ✅ Good - Server actions for forms
"use server";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email");

  if (!isValidEmail(email)) {
    return { error: "Invalid email" };
  }

  await saveSubscription(email);
  revalidatePath("/");

  return { success: true };
}
```

## Summary Checklist

Before committing code, ensure:

- [ ] TypeScript strict mode passes with no errors
- [ ] ESLint shows no warnings
- [ ] Code is formatted with Prettier
- [ ] No console.logs in production code (use proper logging)
- [ ] Images are optimized with proper dimensions
- [ ] Components are as simple as possible
- [ ] Logic is extracted to reusable utilities/hooks
- [ ] File and variable names are clear and consistent
- [ ] Imports are organized and use proper paths
- [ ] Server/Client components are correctly designated

---

**Remember**: Clean code is code that's easy to read, understand, and modify. When in doubt, choose simplicity over cleverness.
