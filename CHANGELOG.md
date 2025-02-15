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
