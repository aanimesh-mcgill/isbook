import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ContentBlock } from '@/types';

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
  sectionTitle?: string;
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <Typography component="p" sx={{ mb: 2 }}>
            {children}
          </Typography>
        ),
        h1: ({ children }) => (
          <Typography variant="h4" component="h2" sx={{ mt: 3, mb: 1 }}>
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="h6" component="h4" sx={{ mt: 2, mb: 1 }}>
            {children}
          </Typography>
        ),
        ol: ({ children }) => (
          <Box
            component="ol"
            sx={{
              pl: 3,
              mb: 2,
              listStyleType: 'decimal',
              listStylePosition: 'outside',
            }}
          >
            {children}
          </Box>
        ),
        ul: ({ children }) => (
          <Box
            component="ul"
            sx={{
              pl: 3,
              mb: 2,
              listStyleType: 'disc',
              listStylePosition: 'outside',
            }}
          >
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Box component="li" sx={{ mb: 0.75, display: 'list-item', pl: 0.5 }}>
            <Typography component="span" variant="body1" sx={{ lineHeight: 1.75 }}>
              {children}
            </Typography>
          </Box>
        ),
        table: ({ children }) => (
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">{children}</Table>
          </TableContainer>
        ),
        thead: ({ children }) => <TableHead>{children}</TableHead>,
        tbody: ({ children }) => <TableBody>{children}</TableBody>,
        tr: ({ children }) => <TableRow>{children}</TableRow>,
        th: ({ children }) => (
          <TableCell component="th" sx={{ fontWeight: 600 }}>
            {children}
          </TableCell>
        ),
        td: ({ children }) => <TableCell>{children}</TableCell>,
        blockquote: ({ children }) => (
          <Box
            component="blockquote"
            sx={{
              borderLeft: 4,
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              my: 2,
              color: 'text.secondary',
            }}
          >
            {children}
          </Box>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <Typography
          variant="h5"
          component="h2"
          id={block.id}
          sx={{ mt: 4, mb: 2, fontWeight: 700 }}
        >
          {block.content}
        </Typography>
      );

    case 'paragraph':
      return block.content ? <MarkdownContent content={block.content} /> : null;

    case 'image':
    case 'figure':
      return (
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <Box
            component="img"
            src={block.imageUrl}
            alt={block.alt ?? block.caption ?? ''}
            sx={{ maxWidth: '100%', height: 'auto', borderRadius: 1 }}
            loading="lazy"
          />
          {block.caption && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {block.caption}
            </Typography>
          )}
        </Box>
      );

    case 'quote':
      return (
        <Box
          sx={{
            borderLeft: 4,
            borderColor: 'secondary.main',
            pl: 2,
            py: 1,
            my: 3,
            fontStyle: 'italic',
          }}
        >
          {block.content && <MarkdownContent content={block.content} />}
        </Box>
      );

    case 'callout':
      return (
        <Alert severity="info" sx={{ my: 3 }}>
          {block.content && <MarkdownContent content={block.content} />}
        </Alert>
      );

    case 'research_box':
      return (
        <Paper
          variant="outlined"
          sx={{
            my: 3,
            p: 2.5,
            bgcolor: 'action.hover',
            borderColor: 'primary.light',
          }}
        >
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
            What Research Tells Us
          </Typography>
          {block.content && <MarkdownContent content={block.content} />}
        </Paper>
      );

    case 'case':
      return (
        <Paper variant="outlined" sx={{ my: 3, p: 2.5 }}>
          <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
            Case Study
          </Typography>
          {block.content && <MarkdownContent content={block.content} />}
        </Paper>
      );

    case 'checklist':
      return (
        <Paper variant="outlined" sx={{ my: 3, p: 2.5 }}>
          <Typography variant="overline" sx={{ fontWeight: 700 }}>
            Manager Checklist
          </Typography>
          {block.content && <MarkdownContent content={block.content} />}
        </Paper>
      );

    case 'ai_exercise':
      return (
        <Paper
          variant="outlined"
          sx={{
            my: 3,
            p: 2.5,
            borderColor: 'secondary.main',
            borderWidth: 2,
          }}
        >
          <Typography variant="overline" color="secondary" sx={{ fontWeight: 700 }}>
            AI Exercise
          </Typography>
          {block.content && <MarkdownContent content={block.content} />}
        </Paper>
      );

    case 'quiz':
    case 'reference':
    case 'table':
      return block.content ? <MarkdownContent content={block.content} /> : null;

    default:
      return block.content ? <MarkdownContent content={block.content} /> : null;
  }
}

/** Merge paragraph blocks that form one markdown ordered list (avoids repeated "1."). */
function coalesceNumberedLists(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === 'paragraph' && block.content && /^\d+\.\s/.test(block.content.trim())) {
      const parts = [block.content];
      let j = i + 1;
      while (j < blocks.length) {
        const next = blocks[j];
        if (next.type !== 'paragraph' || !next.content) break;
        const trimmed = next.content.trim();
        if (/^\d+\.\s/.test(trimmed)) {
          parts.push(next.content);
          j++;
        } else if (/^[^\d]/.test(trimmed) && parts.length > 0) {
          parts[parts.length - 1] += `\n\n${next.content}`;
          j++;
        } else {
          break;
        }
      }
      out.push({ ...block, content: parts.join('\n\n') });
      i = j;
    } else {
      out.push(block);
      i++;
    }
  }

  return out;
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

function skipDuplicateHeading(blocks: ContentBlock[], sectionTitle?: string): ContentBlock[] {
  if (!sectionTitle || blocks.length === 0) return blocks;
  const target = normalizeTitle(sectionTitle);
  const [first, ...rest] = blocks;
  if (first.type === 'heading' && first.content && normalizeTitle(first.content) === target) {
    return rest;
  }
  return blocks;
}

/** Renders an ordered list of Firestore content blocks as textbook content. */
export function ContentBlockRenderer({ blocks, sectionTitle }: ContentBlockRendererProps) {
  if (blocks.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        No content available for this section yet.
      </Typography>
    );
  }

  const displayBlocks = coalesceNumberedLists(skipDuplicateHeading(blocks, sectionTitle));

  return (
    <Box>
      {displayBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </Box>
  );
}
