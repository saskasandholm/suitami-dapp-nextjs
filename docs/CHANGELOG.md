## [Unreleased]

### Added

- Individual skeleton loaders for chart components
  - Added base ChartSkeleton component with customizable dimensions and animations
  - Implemented specific skeleton loaders for SentimentChart and TrendingTopicsChart
  - Enhanced useCommunityData hook with granular loading states for each data type
- New Aiden logo implementation in the sidebar
  - Added collapsible behavior showing only the fox head icon when collapsed
  - Displays full Aiden text next to the icon when expanded
  - Improved visual consistency with the app's design system

### Changed

- Enhanced sidebar navigation animations and interactions
  - Improved animation smoothness for sidebar collapse/expand
  - Added subtle icon-specific hover animations
  - Refined wallet section with smoother transitions and better visual feedback
  - Fixed text bouncing issues during sidebar state changes
- Replaced page-level loading indicator with individual chart skeleton loaders
- Updated community pages to use granular loading states for improved user experience
- Enhanced documentation with skeleton loader implementation details and troubleshooting guide
- Improved heart fill effect in the health score card to fill from empty at 0 to full at scores between 90.0 and 100.0
- Enhanced visual representation of health scores for Telegram, Discord, and Twitter
- Removed percentage change from platform health scores
- Updated social media buttons to reflect connection status visually
- Adjusted wave effect and size of the heart icon for better visibility
