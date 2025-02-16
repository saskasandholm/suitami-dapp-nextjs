# Layout Patterns

## Quick Links
- [Component Library Reference](#component-library)
- [Common UI Patterns](#common-ui-patterns)
- [Style Guide](#style-guide)
- [Accessibility Checklist](#accessibility)

### Quick "Hello World" Example
```tsx
// 1. Install dependencies
pnpm install @headlessui/react @heroicons/react

// 2. Create a basic page layout
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <PageHeader
        title="Dashboard"
        description="Monitor your application metrics"
        rightContent={
          <Button variant="primary" icon={PlusIcon}>
            Add Widget
          </Button>
        }
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card hover-accent">
            <h3 className="text-lg font-medium">Active Users</h3>
            <p className="mt-2 text-white/70">Real-time user count</p>
            <div className="mt-4 text-2xl font-bold">2,543</div>
          </Card>
        </div>
      </main>
    </div>
  );
}
```

## Table of Contents
1. [Overview](#overview)
2. [Component Library](#component-library)
   - [PageHeader](#pageheader-component)
   - [Card](#card-component)
   - [GlassCard](#glasscard-component)
   - [Button](#button-component)
3. [Common UI Patterns](#common-ui-patterns)
   - [Forms](#form-patterns)
   - [Navigation](#navigation-patterns)
   - [Lists & Tables](#lists-and-tables)
   - [Modals & Dialogs](#modals-and-dialogs)
4. [Style Guide](#style-guide)
   - [Spacing & Grid](#spacing--grid-system)
   - [Typography](#typography)
   - [Colors & Themes](#colors-and-themes)
   - [Icons](#iconography)
5. [Accessibility](#accessibility)
6. [Best Practices](#best-practices)
7. [Maintenance Guide](#maintenance-guide)
8. [Changelog](#changelog)

## Overview

This document serves as the primary reference for UI development in our dashboard application. It provides practical guidelines, reusable components, and implementation examples to help you build consistent, accessible, and performant interfaces.

### How to Use This Guide

1. **New Features**: Start with the [Component Library](#component-library) to find existing components you can use.
2. **Styling**: Reference the [Style Guide](#style-guide) for spacing, typography, and color usage.
3. **Patterns**: Check [Common UI Patterns](#common-ui-patterns) for standardized approaches to common UI needs.
4. **Accessibility**: Use the [Accessibility Checklist](#accessibility) before submitting your PR.

## Component Library

### PageHeader Component

A standardized page header with support for titles, descriptions, and action buttons.

**Import**:
```tsx
import PageHeader from '@/components/layout/PageHeader';
```

#### Props
| Prop | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `title` | string | Yes | Main title of the page | - |
| `description` | string | No | Secondary text below title | undefined |
| `rightContent` | ReactNode | No | Right-aligned content (buttons, filters) | undefined |
| `className` | string | No | Additional CSS classes | '' |

#### Common Use Cases

1. **Basic Header**:
```tsx
<PageHeader
  title="Dashboard"
  description="Monitor your AI agents and community engagement"
/>
```

2. **Header with Action Button**:
```tsx
<PageHeader
  title="Knowledge Base"
  description="Manage training data for your AI agents"
  rightContent={
    <Button variant="primary" icon={PlusIcon}>
      Add Document
    </Button>
  }
/>
```

3. **Header with Multiple Actions**:
```tsx
<PageHeader
  title="Community"
  description="Track community engagement and growth"
  rightContent={
    <div className="flex items-center space-x-4">
      <Select
        value={timeRange}
        onChange={setTimeRange}
        options={timeRangeOptions}
      />
      <Button variant="secondary" icon={DownloadIcon}>
        Export Data
      </Button>
    </div>
  }
/>
```

### Card Component

A versatile container for grouping related content with consistent styling.

**Import and Types**:
```tsx
// types/components.ts
interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: ReactNode;
  loading?: boolean;
}

// components/ui/Card.tsx
import { cn } from '@/lib/utils';
import type { CardProps } from '@/types/components';

export function Card({
  children,
  className,
  title,
  description,
  footer,
  loading = false,
}: CardProps) {
  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm',
        'transition-all hover:border-accent/20 hover:bg-accent/5',
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-white/70">{description}</p>
          )}
        </div>
      )}
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-white/10">{footer}</div>}
    </div>
  );
}
```

#### Variants

1. **Basic Card**:
```tsx
<Card>
  <h3 className="text-lg font-medium">Active Users</h3>
  <p className="mt-2 text-white/70">Current active users in your community</p>
  <div className="mt-4">
    <Metric>2,543</Metric>
  </div>
</Card>
```

2. **Glass Card with Hover Effect**:
```tsx
<Card className="glass-card hover-accent">
  <div className="flex items-center space-x-4">
    <Icon className="w-8 h-8 text-accent" />
    <div>
      <h3 className="text-lg font-medium">Response Time</h3>
      <p className="text-white/70">Average: 2.3s</p>
    </div>
  </div>
</Card>
```

3. **Loading State**:
```tsx
<Card loading>
  <MetricsContent />
</Card>
```

### Common CSS Patterns

#### Glass Effect
```css
.glass-card {
  @apply bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all;
}

.hover-accent {
  @apply hover:border-accent/20 hover:bg-accent/5;
}
```

## Maintenance Guide

### Documentation Updates
1. **When to Update**:
   - Adding new components or patterns
   - Modifying existing components
   - Updating styling guidelines
   - Adding new accessibility features
   - Implementing new best practices

2. **Review Process**:
   - Documentation changes require PR review
   - Include before/after screenshots
   - Update all related documentation
   - Run automated checks (spelling, links)
   - Verify code examples compile
   - Update version numbers and changelog

3. **Quality Checklist**:
   - [ ] Code examples include all imports
   - [ ] Type definitions are complete
   - [ ] Examples follow project style guide
   - [ ] Props tables are up-to-date
   - [ ] Screenshots match current UI
   - [ ] Links are valid
   - [ ] Changelog is updated
   - [ ] Version numbers are correct

4. **Regular Maintenance**:
   - Assign documentation owner per sprint
   - Schedule monthly style guide reviews
   - Update component screenshots
   - Review accessibility compliance
   - Check for deprecated patterns
   - Update performance recommendations

### Documentation Structure
- Each component should have:
  - Import statement
  - Props table
  - Common use cases
  - Code examples
  - CSS patterns (if applicable)

### Adding New Components
1. Create component in `src/components`
2. Add to this documentation under appropriate section
3. Include practical examples
4. Update table of contents
5. Add to changelog

### Tools
- Component Preview: [Storybook](http://localhost:6006)
- Style Guide: [Tailwind CSS](https://tailwindcss.com)
- Accessibility: [axe DevTools](https://www.deque.com/axe/)

## Changelog

### [1.0.3] - 2024-03-XX

#### Added
- Quick links section for faster navigation
- Detailed component usage examples
- Common CSS patterns section
- Maintenance guide
- Documentation structure guidelines
- Tools and resources section

#### Enhanced
- Component documentation with import statements
- Props tables with default values
- Code examples with practical use cases
- Accessibility guidelines with testing procedures 