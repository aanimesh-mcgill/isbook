# Firestore Database Schema

## Collections

### `books`

| Field | Type | Description |
|-------|------|-------------|
| title | string | Book title |
| subtitle | string? | Optional subtitle |
| description | string | Short description |
| slug | string | URL-safe identifier |
| status | string | `draft` \| `published` \| `archived` |
| coverImageUrl | string? | Storage URL |
| partCount | number | Number of parts |
| chapterCount | number | Total chapters |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |
| publishedAt | string? | ISO timestamp |

### `chapters`

| Field | Type | Description |
|-------|------|-------------|
| bookId | string | Parent book ID |
| title | string | Chapter title |
| slug | string | URL-safe identifier |
| partNumber | number | Part number (1, 2, …) |
| partTitle | string | Part title |
| chapterNumber | number | Chapter number within book |
| summary | string? | Brief summary |
| order | number | Sort order |
| status | string | `draft` \| `published` \| `archived` |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

### `sections`

| Field | Type | Description |
|-------|------|-------------|
| bookId | string | Parent book ID |
| chapterId | string | Parent chapter ID |
| title | string | Section title (e.g. "Opening Case") |
| slug | string | URL-safe identifier |
| order | number | Sort order within chapter |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

### `contentBlocks`

| Field | Type | Description |
|-------|------|-------------|
| bookId | string | Parent book ID |
| chapterId | string | Parent chapter ID |
| sectionId | string | Parent section ID |
| type | string | Block type (see below) |
| order | number | Sort order within section |
| content | string? | Markdown content |
| imageUrl | string? | Image/figure URL |
| caption | string? | Image caption |
| alt | string? | Image alt text |
| metadata | object? | Type-specific data |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

#### Content Block Types

`heading`, `paragraph`, `image`, `figure`, `table`, `quote`, `callout`, `research_box`, `case`, `quiz`, `ai_exercise`, `checklist`, `reference`

### `users`

| Field | Type | Description |
|-------|------|-------------|
| uid | string | Firebase Auth UID |
| email | string? | Email address |
| displayName | string? | Display name |
| role | string | User role |
| photoURL | string? | Avatar URL |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

### `bookmarks`, `notes`, `highlights`

User-owned subcollections linked to book/chapter/section positions.

## Composite Indexes

See `firestore.indexes.json` for required composite indexes.

## Security

See `firestore.rules` — published content is publicly readable; writes require staff roles.
