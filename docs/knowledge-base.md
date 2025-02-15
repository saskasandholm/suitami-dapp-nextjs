# Knowledge Base Documentation

## Overview

The Knowledge Base is a centralized system for managing training data and information sources for AI agents. It provides tools for uploading documents, managing URLs, and creating FAQs that agents can use to fetch information.

## Features

### Document Management

- Upload PDF documents with drag-and-drop support
- Real-time processing status tracking
- Document indexing for AI agent training
- Size and upload date tracking
- Document removal capability

### URL Source Management

- Add external URL sources with titles
- Automatic content indexing
- Status tracking (processing, indexed, failed)
- Source validation and management
- Easy removal of outdated sources

### FAQ Management

- Create and organize frequently asked questions
- Categorize FAQs (General, Technical, Platform, Community)
- Rich text support for answers
- Category-based organization
- Quick editing and removal

### Notification System

- Real-time feedback for all operations
- Persistent error notifications requiring manual dismissal
- Auto-dismissing success notifications (5 seconds)
- Informative processing status updates
- Stacked notifications for multiple operations
- Accessible notifications with ARIA support

## Usage

### Adding Documents

1. Navigate to the Knowledge Base page
2. Select the "Documents" tab
3. Drag and drop PDF files or click to select
4. Monitor processing status via notifications
5. Wait for indexing completion
6. Check success/error notifications

### Managing URLs

1. Go to the "URLs" tab
2. Enter source title and URL
3. Click "Add" to begin processing
4. Monitor indexing status via notifications
5. Remove or update as needed
6. Handle any error notifications

### Creating FAQs

1. Select the "FAQs" tab
2. Fill in question and answer fields
3. Select appropriate category
4. Click "Add FAQ"
5. Monitor success/error notifications
6. Edit or remove as needed

## Integration with Agent Training

- Documents and URLs are automatically processed for agent training
- FAQs are used to improve agent responses
- All knowledge base items contribute to agent intelligence
- Real-time updates reflect in agent behavior

## Best Practices

1. Use clear titles and descriptions
2. Organize content by categories
3. Regularly review and update sources
4. Monitor processing status
5. Remove outdated information
6. Maintain consistent formatting
7. Address error notifications promptly
8. Verify successful operations

## Technical Details

- Supported file types: PDF
- Maximum file size: 10MB
- URL processing timeout: 30 seconds
- Supported URL protocols: HTTP, HTTPS
- FAQ character limits:
  - Question: 200 characters
  - Answer: 1000 characters
- Notification types:
  - Success (auto-dismissing)
  - Error (persistent)
  - Info (auto-dismissing)
- Notification display time: 5 seconds (non-error)
