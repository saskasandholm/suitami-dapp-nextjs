# Aiden dApp

A modern, performant Next.js application designed to help community managers and developers understand and improve community health and engagement. Aiden dApp provides real-time analytics, AI-powered insights, and automated management tools across platforms like Discord, Telegram, and Twitter.

## Features

### Community Analytics
- **Real-time Insights** 📊
  - Live community metrics and engagement tracking
  - Anomaly detection with AI-powered analysis
  - Customizable dashboards and reporting
- **Multi-platform Integration** 🔗
  - Discord, Telegram, and Twitter support
  - Unified analytics across platforms
  - Platform-specific metrics and insights
- **Performance & Accessibility** ⚡
  - Optimized chart rendering and data visualization
  - WCAG 2.1 compliant interface
  - Mobile-responsive design

### Performance Optimizations
- Efficient component lifecycle management
- Optimized rendering patterns
- Smart loading state handling
- Error boundary implementation
- Memory leak prevention

### Technical Stack
- [Next.js 14](https://nextjs.org/) with App Router - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Tremor](https://www.tremor.so/) - Data visualization
- [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing
- [ESLint](https://eslint.org/) - Code quality

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Documentation

1. [Community Analytics](./docs/community-analytics.md) - Core analytics features and implementation
2. [Layout Patterns](./docs/LAYOUT_PATTERNS.md) - UI components and design system
3. [Knowledge Base](./docs/knowledge-base.md) - Training data management
4. [Training Center](./docs/training-center.md) - AI agent training
5. [Changelog](./CHANGELOG.md) - Version history and updates

## Best Practices

### Performance
- Use optimized rendering patterns ([see examples](./docs/LAYOUT_PATTERNS.md#performance))
- Implement proper loading states ([implementation guide](./docs/community-analytics.md#loading-states))
- Handle errors gracefully ([error handling patterns](./docs/community-analytics.md#error-handling))
- Follow React best practices ([component guidelines](./docs/LAYOUT_PATTERNS.md#best-practices))
- Optimize data fetching ([data fetching strategies](./docs/community-analytics.md#data-fetching))

### Accessibility
- ARIA labels for interactive elements ([accessibility guide](./docs/LAYOUT_PATTERNS.md#accessibility))
- Keyboard navigation support ([keyboard patterns](./docs/LAYOUT_PATTERNS.md#keyboard-navigation))
- Screen reader compatibility ([screen reader support](./docs/LAYOUT_PATTERNS.md#screen-reader-support))
- Clear visual feedback ([visual patterns](./docs/LAYOUT_PATTERNS.md#visual-accessibility))
- Semantic HTML structure ([HTML guidelines](./docs/LAYOUT_PATTERNS.md#semantic-html))

### Development
- Follow TypeScript best practices ([type safety guide](./docs/community-analytics.md#typescript))
- Maintain consistent code style ([style guide](./docs/LAYOUT_PATTERNS.md#style-guide))
- Write comprehensive tests ([testing guide](./docs/community-analytics.md#testing))
- Document code changes ([documentation guide](./docs/community-analytics.md#documentation))
- Use proper error handling ([error patterns](./docs/community-analytics.md#error-handling))

## Contributing

We welcome contributions to Aiden dApp! Please see our [Contributing Guide](./CONTRIBUTING.md) for detailed instructions on:

1. Setting up your development environment
2. Creating feature branches
3. Following our coding standards
4. Writing and running tests
5. Submitting pull requests

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) team for providing the powerful framework that serves as the foundation for Aiden dApp
- [Tremor](https://www.tremor.so/) for their beautiful and performant chart components that power our analytics
- [Framer Motion](https://www.framer.com/motion/) for enabling smooth animations that enhance our user experience
- [Tailwind CSS](https://tailwindcss.com/) for their utility-first CSS framework that streamlines our styling
- [HeadlessUI](https://headlessui.com/) for their accessible UI components that help maintain high accessibility standards

## Changelog

### [0.13.7] - 2024-02-15

- Enhanced Testing Infrastructure:
  - Added Jest configuration with coverage reporting
  - Integrated React Testing Library
  - Added component-level unit tests
  - Implemented accessibility testing
  - Added mock implementations for external dependencies
  - Updated test scripts with passWithNoTests flag
  - Configured coverage thresholds
  - Added test setup file with DOM matchers

### [0.13.6] - 2024-02-15

- Enhanced Community Analytics Accessibility and Error Handling:
  - Added comprehensive ARIA labels for all charts
  - Improved screen reader support with descriptive text
  - Enhanced loading states and error recovery
  - Added visual feedback for metric changes
  - Implemented robust error handling for data loading
  - Updated documentation with best practices
  - Added TypeScript improvements for better type safety

### [0.13.5] - 2024-02-15

- Enhanced Community Analytics Features:
  - Added drill-down capability in member growth charts
  - Implemented hourly data visualization
  - Added interactive tooltips and hover states
  - Integrated CSV data export functionality
  - Enhanced chart legends and data formatting
  - Added detailed metric selection for exports
  - Improved chart interactivity and user feedback

### [0.13.4] - 2024-02-15

- Added Enhanced Community Analytics Features:
  - Implemented anomaly detection using z-score analysis
  - Added Community Health Score calculation
  - Integrated direct links to community platforms
  - Added custom date range selection
  - Implemented visual indicators for anomalies
  - Enhanced interactive charts and visualizations
  - Improved UI with health score card and metric cards

### [0.13.8] - 2024-03-XX

- Enhanced Performance:
  - Optimized chart rendering
  - Improved loading state management
  - Removed unnecessary render states
  - Enhanced error handling
  - Updated documentation
  - Improved component lifecycle management
