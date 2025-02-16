# Suitami dApp

A modern decentralized application for managing autonomous AI agents for Web3 communities.

## Overview

Suitami provides an intelligence layer that empowers Web3 communities with autonomous AI agents, trained to manage, engage, and grow your ecosystem. The platform enables seamless integration of AI agents across various platforms including Telegram, Discord, and X (Twitter).

## Technology Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint
- pnpm (Package Manager)
- Tremor (Analytics & Charts)
- Framer Motion (Animations)
- Headless UI (Accessible Components)
- Heroicons (Icons)
- Jest & Testing Library (Testing)

## Features

- Modern, responsive UI with exceptional polish:
  - Sophisticated animations and transitions
  - Perfect micro-interactions
  - Optimized performance
  - Comprehensive accessibility
- Community Analytics with polished data visualization:
  - Interactive charts with perfect animation timing
  - Smooth transitions and natural motion
  - Intelligent tooltips with perfect positioning
  - Cross-chart communication with subtle highlights
  - Responsive and accessible design
- AI Agent Management Dashboard
- Multi-platform Integration (Telegram, Discord, X)
- Agent Performance Monitoring
- Custom Agent Training Interface
- Notification System
  - Notification queueing for multiple messages
  - Type-based persistence (errors persist, others auto-hide)
  - Keyboard navigation support
  - ARIA accessibility compliance
  - Improved stacking and positioning
  - Clear error messages with context
  - Auto-hiding for non-error notifications
- Validation System
  - Comprehensive input validation
  - File size and type checks
  - URL protocol and format validation
  - FAQ content length limits
  - Structured data validation
  - Real-time validation feedback
- Document Management
  - File upload with size and type validation
  - Progress tracking for document processing
  - Automatic status updates
- URL Source Management
  - URL validation with protocol checks
  - Processing status tracking
  - Easy deletion and management
- FAQ Management
  - Categorized FAQ entries
  - Length validation for questions and answers
  - Easy editing and deletion
- Testing Infrastructure
  - Jest configuration with coverage reporting
  - React Testing Library integration
  - Component-level unit tests
  - Accessibility testing support
  - Mock implementations for external dependencies

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm
- Modern web browser

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Run validation
pnpm run validate
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_WALLET_CONNECT_ID=your_wallet_connect_id
```

## Project Structure

```
src/
├── app/              # App router pages
├── components/       # Reusable components
│   ├── layout/      # Layout components
│   ├── ui/          # UI components
│   └── agents/      # AI agent management components
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Documentation

Detailed documentation for each component can be found in the `docs/` directory:

- [Community Analytics](docs/community-analytics.md)
- [Training Center](docs/training-center.md)

## Contributing

Please read our contributing guidelines before submitting pull requests.

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tremor for beautiful charts
- Framer Motion for smooth animations
- Tailwind CSS for styling
- HeadlessUI for accessible components
- Testing Library team for testing utilities
