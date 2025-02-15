# Changelog

## [0.11.6] - 2024-02-14

### Added

- Centralized notification system using React Context
- Notification queueing system for handling multiple notifications
- Persistent error notifications with manual dismissal
- Enhanced accessibility for notifications with ARIA attributes
- Keyboard navigation support for notification dismissal
- Improved notification stacking and positioning
- Additional validation rules for structured data
- Real-time operation feedback through notifications

### Changed

- Migrated from component-based to context-based notifications
- Updated notification behavior based on type (errors persist, others auto-hide)
- Enhanced notification styling for better visibility
- Improved notification z-index handling
- Updated documentation with notification system details
- Standardized notification patterns across all components
- Made root layout client-side to support NotificationProvider
- Ensured NotificationProvider is correctly placed at the root level
- Standardized notification handling across all components

### Fixed

- Notification overlap issues
- Accessibility issues with notification contrast
- Keyboard navigation gaps
- TypeScript errors related to notification props
- Inconsistent notification behavior across components
- Fixed notification context availability issues in knowledge base components
- Resolved 'useNotification must be used within a NotificationProvider' error

## [0.11.5] - 2024-02-14

### Added

- FAQ category dropdown with predefined categories
- Enhanced notification system with auto-hide functionality
- Loading states for all async operations
- File validation with size and type checks
- URL validation with protocol checks
- FAQ validation with length limits

### Changed

- Improved type definitions for better type safety
- Enhanced error messages with more context
- Updated UI components for better user feedback
- Refactored state management for better reliability

### Fixed

- Type errors in FAQ category handling
- Race conditions in document processing
- Memory leaks from unmounted components
- Duplicate ID generation issues

## [0.11.4] - Previous version

## [0.11.7] - 2024-02-14

### Changed

- Separated root layout into server and client components for proper metadata handling
- Moved NotificationProvider to a dedicated client layout component
- Improved Next.js 14 App Router compatibility

### Fixed

- Fixed "attempting to export metadata from a component marked with 'use client'" error
- Resolved metadata export issues in client components

## [0.11.8] - 2024-02-14

### Fixed

- Removed duplicate notifications by removing Pages Router implementation
- Cleaned up legacy \_app.tsx file
- Ensured single instance of NotificationProvider in App Router

## [0.11.9] - 2024-02-14

### Fixed

- Removed duplicate notifications in FAQ and URL panels by centralizing notification handling in parent component
- Improved notification management in knowledge base components
- Ensured consistent notification behavior across all knowledge base panels

## [0.12.0] - 2024-02-14

### Added

- Comprehensive settings page with multiple sections:
  - Profile management with user information
  - Team management with role controls
  - Notification preferences for agent updates
  - Security settings with 2FA support
  - Admin controls for API and webhook management
- Enhanced UI components:
  - Custom toggle switches for preferences
  - Responsive grid layouts
  - Animated tab transitions
  - Modern form controls
- Display preferences for agent views and metrics
- Usage statistics dashboard in admin panel

### Changed

- Updated global button styling
- Improved form input consistency
- Enhanced mobile responsiveness for settings panels

## [0.12.1] - 2024-02-14

### Added

- New Moderation Log tab in settings:
  - Detailed activity tracking for admin actions
  - Filterable log entries by action type
  - Timestamp and moderator tracking
  - Export functionality for logs
  - Pagination support for log entries
- Enhanced logging interface with:
  - Action categorization
  - Target identification
  - Detailed action descriptions
  - Chronological ordering

### Changed

- Updated settings navigation to include moderation log
- Improved action tracking granularity
- Enhanced log entry styling and readability

## [0.12.2] - 2024-02-14

### Added

- Enhanced Agents page with new features:
  - Agent deployment system with templates
  - Filtering by use case (Community Management, Social Engagement)
  - Platform-specific filtering (Discord, Twitter, Instagram, LinkedIn)
  - Agent metrics dashboard
  - Status indicators for active agents
  - Quick actions for configuration and details
- New deployment modal with:
  - Pre-configured templates for different use cases
  - Multi-platform support
  - Visual platform indicators
  - Streamlined deployment process

### Changed

- Redesigned agents list view with metrics
- Improved filtering UI with platform-specific icons
- Enhanced agent card design with status and metrics
- Added Radix UI icons for better platform representation

## [0.12.3] - 2024-02-15

### Changed

- Updated supported platforms to focus on Telegram, Discord, and Twitter
- Enhanced agent cards with profile pictures and improved layout
- Streamlined platform selection in deployment modal

## [0.12.4] - 2024-02-15

### Changed

- Standardized page headers across all dashboard pages:
  - Consistent title and description styling
  - Unified spacing and layout
  - Standardized gradient effects
- Improved page load animations:
  - Removed animation from page headers for instant visibility
  - Maintained content section animations for better UX
  - Consistent animation timing across all pages

## [0.12.5] - 2024-02-15

### Added

- Enhanced Training Center with new features:
  - Primary view for agent actions and community feedback
  - Thumbs up/down voting system for agent responses
  - Edit functionality for agent responses
  - Direct links to original posts/comments
  - Context display for agent responses
  - Advanced training features moved to separate tab
  - Real-time feedback tracking
  - Support for different action types (replies, posts, moderation)

### Changed

- Reorganized Training Center interface:
  - Split into "Recent Actions" and "Advanced Training" tabs
  - Improved action card design with feedback controls
  - Enhanced visibility of action context and metadata
  - Better organization of training controls and settings

## [0.12.6] - 2024-02-15

### Added

- Redesigned Training Center interface:
  - Combined view of all agents' actions with filtering capabilities
  - Search functionality for actions and agent responses
  - Platform, action type, and agent type filters
  - Basic metrics dashboard showing review status and feedback counts
  - "Needs Review" indicators for unreviewed actions
  - Agent attribution for each action

### Changed

- Moved tabs to top level for better navigation between review and advanced features
- Enhanced action cards with additional metadata and context
- Improved filtering and search UX
- Reorganized metrics display for better overview

## [0.12.7] - 2024-02-15

### Added

- Enhanced action feed display in Training Center:
  - Action type icons for replies, posts, and moderation actions
  - Content truncation with "Show More" functionality for long responses
  - Sorting options (newest, oldest, most upvotes, most downvotes)
  - Improved visual hierarchy for action metadata

### Changed

- Reorganized action card layout:
  - Prominent action type icons and badges
  - Better grouping of agent information and platform
  - Clearer timestamp placement
  - Enhanced context display
  - More readable content formatting

## [0.12.8] - 2024-02-15

### Added

- Enhanced voting system in Training Center:
  - Immediate visual feedback with animations
  - Clear vote count display with bold numbers
  - User vote indication with "(Voted)" label
  - Vote timestamps for tracking
  - Ring highlight for active votes
  - Tooltips showing vote status
- Improved edit functionality:
  - Version history tracking for edited responses
  - Tooltips for edit buttons
  - Clear visual indication of editable actions
- Enhanced direct links:
  - Tooltips for link buttons
  - Clear visual feedback on hover
  - Automatic new tab opening

### Changed

- Improved action card UI:
  - Better visual hierarchy for votes and controls
  - Enhanced hover states for all interactive elements
  - More consistent spacing and alignment
  - Added tooltips to all interactive elements
- Updated voting system to store timestamps
- Enhanced edit history tracking for agent responses

## [0.12.9] - 2024-02-15

### Added

- Enhanced accessibility features in Training Center:
  - ARIA labels for all interactive elements
  - Screen reader-friendly text for context and responses
  - Improved keyboard navigation support
  - Focus management for modal dialogs
  - Role attributes for semantic structure
- Comprehensive tooltips and visual feedback:
  - Action type indicators with descriptive tooltips
  - Vote status tooltips showing user's previous votes
  - Edit button tooltips with keyboard shortcuts
  - Platform and context tooltips
- Error handling improvements:
  - Graceful error recovery for failed votes
  - Local storage for unsaved edits
  - Network error notifications
  - Validation feedback for edit submissions

### Changed

- Improved Training Center visual hierarchy:
  - Better spacing and alignment of action cards
  - Enhanced contrast for important elements
  - Consistent typography and color usage
  - Smoother animations and transitions
- Enhanced responsive design:
  - Better mobile and tablet layouts
  - Improved touch targets for mobile
  - Adaptive content truncation
  - Responsive metrics dashboard
- Updated documentation:
  - Expanded usage guides
  - Added keyboard shortcuts
  - Included best practices
  - Error handling procedures

### Fixed

- Edge case handling in voting system
- Mobile viewport issues
- Animation performance on slower devices
- Focus trap in modal dialogs
- Screen reader announcement timing

## [0.13.0] - 2024-02-15

### Added

- Enhanced visual consistency across all icons and badges:
  - Standardized icon sizes (w-5 h-5 for action icons)
  - Consistent background colors for icon containers
  - Unified badge padding (px-2 py-1)
  - Standardized font weights and transitions
- Improved interactive elements:
  - Added keyboard shortcut hints to tooltips
  - Enhanced tooltip text clarity
  - Added "(opens in new tab)" indicators
  - Consistent hover states and transitions
- Enhanced visual hierarchy:
  - Consistent spacing between elements
  - Clear visual distinction between badge types
  - Improved alignment of icon and text elements
  - Better contrast for important elements

### Changed

- Updated icon styling:
  - Added transition-colors to all icons
  - Standardized icon container backgrounds
  - Improved icon spacing and alignment
- Enhanced badge consistency:
  - Unified background opacity levels (10%)
  - Standardized padding and font weights
  - Added smooth state transitions
- Improved overall UI consistency:
  - Standardized hover effects
  - Unified animation timings
  - Consistent spacing patterns
  - Enhanced visual feedback
