# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Flyball Hub is a flyball team management application built with a TurboRepo monorepo architecture. The project consists of a Next.js 15 frontend (`apps/web`) and a Sanity Studio CMS (`apps/studio`), with shared packages for UI components and configuration.

## Development Commands

### Root Level (Monorepo)
```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm lint             # Run linting across all apps
pnpm check-types      # Type check all apps
pnpm format           # Format code with Prettier
```

### Web App (apps/web)
```bash
cd apps/web
pnpm dev              # Start Next.js dev server (localhost:3000)
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm typecheck        # Type check without emitting
pnpm check            # Run lint, format check, and typecheck
```

### Studio (apps/studio)
```bash
cd apps/studio
pnpm dev              # Start Sanity Studio (localhost:3333)
pnpm build            # Build Studio for production
pnpm deploy           # Deploy Studio to Sanity hosting
pnpm type             # Generate TypeScript types from schema
pnpm extract          # Extract schema (part of type generation)
```

**IMPORTANT**: After adding or modifying Sanity schemas, always run:
```bash
cd apps/studio
pnpm type
```
This generates TypeScript definitions that are consumed by the web app.

## Architecture

### Monorepo Structure
- **apps/web**: Next.js 15 frontend with App Router
- **apps/studio**: Sanity Studio v3 CMS
- **packages/ui**: Shared UI components (Shadcn-based)
- **packages/typescript-config**: Shared TypeScript configurations
- **packages/eslint-config**: Shared ESLint configurations

### Frontend Architecture (apps/web)

#### Directory Structure
- **src/app**: Next.js App Router pages and API routes
- **src/components**: React components
  - `sections/`: Page builder block components (hero, cta, faq, etc.)
  - `elements/`: Reusable UI elements
  - `pagebuilder.tsx`: Main renderer that maps Sanity blocks to components
- **src/lib/sanity**: Sanity client configuration and GROQ queries
- **src/actions**: Server actions for forms and mutations
- **src/hooks**: Custom React hooks

#### Page Builder System
The frontend uses a dynamic page builder pattern:

1. **Schema Definition** (apps/studio/schemaTypes/definitions/pagebuilder.ts):
   - Defines available blocks as an array type
   - Blocks are defined in `apps/studio/schemaTypes/blocks/`

2. **Query Fragments** (apps/web/src/lib/sanity/query.ts):
   - Each block type has a corresponding GROQ fragment
   - Fragments are composed into `pageBuilderFragment`
   - Common patterns reused via fragments (images, buttons, richText)

3. **Component Mapping** (apps/web/src/components/pagebuilder.tsx):
   - `BLOCK_COMPONENTS` object maps block type to React component
   - Renders blocks dynamically based on Sanity data
   - Includes optimistic updates for live preview

#### Adding a New Page Builder Block

1. Create schema in `apps/studio/schemaTypes/blocks/your-block.ts`
2. Export it from `apps/studio/schemaTypes/blocks/index.ts`
3. Add GROQ fragment to `apps/web/src/lib/sanity/query.ts`
4. Create component in `apps/web/src/components/sections/your-block.tsx`
5. Map component in `apps/web/src/components/pagebuilder.tsx` (BLOCK_COMPONENTS)
6. Run `cd apps/studio && pnpm type` to generate types

### Sanity CMS Architecture (apps/studio)

#### Directory Structure
- **schemaTypes/documents**: Top-level document types (blog, page, settings)
- **schemaTypes/blocks**: Page builder blocks (hero, cta, faq, etc.)
- **schemaTypes/definitions**: Reusable field definitions (button, richText, pageBuilder)
- **components**: Custom Sanity Studio components
- **plugins**: Studio plugins and configuration

#### Schema Organization
Each folder has an `index.ts` that exports an array of all schemas in that folder. This pattern makes it easy to import all schemas at once:

```typescript
// Example: schemaTypes/blocks/index.ts
import { hero } from './hero';
import { cta } from './cta';

export const pageBuilderBlocks = [hero, cta, ...];
```

#### Key Conventions
- Always use `defineField`, `defineType`, and `defineArrayMember` from Sanity
- Include icons from `@sanity/icons` (preferred) or `lucide-react`
- Always add descriptions for non-technical users
- File names use kebab-case: `feature-cards-icon.ts`
- Field order: description, name, title, type

## Component Guidelines

### Frontend (apps/web)
- **Prefer `grid` over `flex`** unless working with simple two-sibling layouts
- Use semantic HTML elements
- Use `SanityImage` component for Sanity-sourced images
- Use the `Buttons.tsx` resolver for button components
- File naming: **kebab-case** for all files (e.g., `user-profile.tsx`)
  - Use `.tsx` for React components
  - Use `.ts` for utilities

### Internationalization
Only apply when specifically requested:
- Replace directional properties with logical equivalents:
  - `left/right` → `start/end`
  - `ml/mr` → `ms/me`
  - `pl/pr` → `ps/pe`
  - `border-l/border-r` → `border-s/border-e`
  - `text-left/text-right` → `text-start/text-end`

## GROQ Query Conventions

Located in `apps/web/src/lib/sanity/query.ts`:

### Structure
- Import `defineQuery` and `groq` from `next-sanity`
- Define reusable fragments at the top (prefixed with underscore)
- Export queries as constants using `defineQuery`

### Naming
- Use camelCase: `queryHomePageData`
- Prefix with action verb: `get`, `getAll`, `query`
- Suffix with "Query": `queryBlogSlugPageData`
- Fragment names: `_richText`, `_buttons`, `_imageFields`

### Best Practices
- **Do NOT expand images in GROQ unless explicitly instructed**
- Use explicit filtering: `_type == "blog"`
- Prefer projections over full documents
- Use `select()` for conditional logic
- Use `coalesce()` for defaults
- Check `defined(field)` before accessing optional fields
- Add comments for complex query logic

### Example Pattern
```groq
const fragment = /* groq */ `
  fieldName {
    ...
  }
`;

export const queryName = defineQuery(`
  *[_type == "documentType" && slug.current == $slug][0]{
    ...,
    ${fragment}
  }
`);
```

## Sanity Schema Field Templates

Common field patterns (from .cursor/rules/sanity-rules.mdc):

**Eyebrow**: Small text above title
**Title**: Large primary heading
**Rich Text**: Formatted text with links, lists, headings
**Buttons**: Array of button objects
**Image**: Image with alt text field
**isHeadingOne**: Toggle to make title an `<h1>` tag

Always include clear descriptions for content editors.

## Environment Variables

Web app requires:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_API_READ_TOKEN`
- Additional Sanity configuration in `apps/web/src/config.ts`

Studio requires:
- Sanity project configuration in `sanity.config.ts`

## Key Technologies

- **Next.js 15**: App Router, Server Components, Server Actions
- **React 19**: With React Compiler enabled
- **Sanity v4**: Headless CMS with Visual Editing
- **TurboRepo**: Monorepo build system
- **Shadcn UI**: Component library (via packages/ui)
- **Tailwind CSS**: Styling
- **TypeScript 5.9**: Strict mode enabled
- **pnpm**: Package manager (version 10.12.2)

## Deployment

- **Web app**: Deploy to Vercel (set root directory to `apps/web`)
- **Studio**: Deploy with `cd apps/studio && pnpm deploy`
  - Requires environment variables configured in GitHub secrets
  - See README.md for full deployment instructions

## Live Preview

The app uses `@sanity/visual-editing` for live preview in Sanity Studio. The pagebuilder.tsx component includes optimistic updates to support this feature.
