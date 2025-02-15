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

## Features

- Modern, responsive UI
- AI Agent Management Dashboard
- Multi-platform Integration (Telegram, Discord, X)
- Community Analytics
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

### Community Analytics

- Real-time community metrics across platforms (Telegram, Discord, Twitter)
- Interactive charts with drill-down capabilities
- Anomaly detection for key metrics
- Community Health Score
- Sentiment analysis and trending topics
- Custom date range analysis
- Data export functionality
- Platform-specific insights
- Accessibility-first design

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

## Contributing

Please read our contributing guidelines before submitting pull requests.

## Changelog

### Version 0.11.4 (Latest)

- Added Git Hooks and CI:
  - Implemented Husky for Git hooks
  - Added lint-staged for pre-commit checks
  - Set up GitHub Actions workflow for CI
  - Added Prettier configuration
  - Enhanced code quality automation
  - Improved developer workflow
  - Added automated checks for TypeScript, ESLint, and builds

### Version 0.11.3 (Latest)

- Fixed Layout and Styling Issues:
  - Improved layout structure with proper nesting
  - Fixed dashboard layout and sidebar behavior
  - Added proper height classes for full-screen layouts
  - Updated Tremor component styling for dark mode
  - Added PostCSS configuration
  - Fixed CSS linting issues
  - Enhanced responsive design

### Version 0.11.2 (Latest)

- Improved KnowledgeBase Component Architecture:
  - Created shared types for Document, Source, and FAQ interfaces
  - Simplified form handling with local state management
  - Improved type safety and consistency across components
  - Removed duplicate code and redundant interfaces
  - Enhanced UI/UX with better loading states and error handling

### Version 0.11.1

- Fixed TypeScript Interface Consistency:
  - Added missing title and subtitle properties to Document, Source, and FAQ interfaces
  - Made agentId prop optional in KnowledgeBase component for standalone usage
  - Updated handler functions to be async for better state management
  - Improved type safety across knowledge base components
  - Enhanced error handling with proper Promise support
  - Added proper TypeScript generics for item data handling

### Version 0.11.0

- Fixed TypeScript Configuration and Component Structure:
  - Updated TypeScript configuration for better type safety
  - Fixed moduleResolution in tsconfig.json
  - Added proper type definitions for React and React DOM
  - Resolved component syntax errors in Layout component
  - Removed duplicate KnowledgeBase component
  - Enhanced ESLint configuration for TypeScript
  - Updated package dependencies to latest versions
  - Improved code organization and maintainability

### Version 0.10.0

- Enhanced Knowledge Base Management:
  - Added real-time loading states and progress indicators for document processing and URL indexing
  - Implemented comprehensive form validation with clear error messages
  - Added user notifications for successful/failed operations
  - Improved error handling with user-friendly error messages
  - Added validation for URLs and FAQ content length
  - Enhanced UI feedback during loading and processing states
  - Added loading overlays for processing items
  - Improved accessibility with ARIA labels and error descriptions

### [0.9.0] - 2024-02-12

- Enhanced Navigation and User Flow:
  - Improved tab organization in Agents page
  - Renamed "Settings" tab to "Configuration" for clarity
  - Reordered tabs to follow logical workflow:
    - Configuration (basic settings)
    - Agent Knowledge Base (data input)
    - Training Data (advanced examples)
    - Responses (behavior definition)
  - Added context-aware titles and descriptions
  - Improved agent template selection cards
  - Integrated avatar support in agent cards
  - Enhanced visual hierarchy and component organization
  - Added clear section descriptions and placeholders

### [0.8.0] - 2024-02-12

- Added Agent Customization Features:
  - Profile picture upload and management
  - Agent name customization
  - Platform-specific display settings
  - Personality trait configuration
  - Communication style settings
  - Response length preferences
  - Status message customization
  - Real-time preview of changes
  - Improved agent card design with avatars

### [0.7.0] - 2024-02-12

- Added dedicated Knowledge Base and Training Center pages:
  - New sidebar navigation items for quick access
  - Standalone Knowledge Base page for centralized data management
  - Training Center with overview of all agents' training status
  - Interactive agent selection and training controls
  - Real-time training progress monitoring
  - Visual status indicators and progress tracking
  - Unified training management interface

### [0.6.0] - 2024-02-12

- Added Knowledge Base Management:
  - PDF document upload and processing
  - URL source management with indexing
  - FAQ creation and categorization
  - Real-time processing status indicators
  - Document and source tracking
  - Integrated with agent training system
  - Drag-and-drop file upload support

### [0.5.0] - 2024-02-12

- Enhanced Agent Management page with:
  - Integrated real-time training visualization
  - Interactive training controls (start/stop)
  - Dynamic platform selection based on template
  - Training progress tracking with metrics
  - Visual feedback for training status
  - Improved template selection UI

### [0.4.0] - 2024-02-12

- Added Conversations page with:
  - Real-time conversation monitoring
  - Message filtering by category and platform
  - Quick stats for active conversations and response metrics
  - Response templates management
  - Quick actions for common tasks
- Added Agent Training visualization with:
  - Real-time training progress tracking
  - Accuracy and loss metrics visualization
  - Training configuration display
  - Interactive charts for model performance
  - Training status indicators

### [0.3.0] - 2024-02-12

- Added Community Analytics page with:
  - Member growth tracking
  - Platform-specific engagement metrics
  - Community sentiment analysis
  - Real-time statistics
  - Interactive charts and visualizations
- Enhanced Agent Management with:
  - Real-time performance monitoring
  - Agent health metrics
  - Response time tracking
  - Accuracy measurements
  - Activity logs
  - Resource usage monitoring

### [0.2.0] - 2024-02-12

- Added Dashboard layout with collapsible sidebar
- Implemented dark theme with custom colors (#011829, #030f1c, #000000, #87fafd)
- Created Dashboard overview page with:
  - Quick stats cards
  - Platform-specific metrics
  - Active agents list
  - Platform integration status
- Created Agent Management page with:
  - Agent templates
  - Configuration interface
  - Training data input
  - Response template management
- Added animations and transitions using Framer Motion
- Integrated Tremor for analytics components
- Added glass-effect UI components
- Implemented responsive design for all pages

### [0.1.0] - 2024-02-12

- Initial project setup
- Basic project structure
- Documentation setup

## Recent Updates (v0.11.6)

- Enhanced notification system with queueing and persistence
- Improved accessibility with ARIA support and keyboard navigation
- Added persistent error notifications
- Enhanced validation rules for structured data

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
