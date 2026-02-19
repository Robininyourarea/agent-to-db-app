
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Typography, Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface MarkdownRendererProps {
    children: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }} {...props} />,
                h2: ({ node, ...props }) => <Typography variant="h5" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }} {...props} />,
                h3: ({ node, ...props }) => <Typography variant="h6" gutterBottom sx={{ mt: 1.5, fontWeight: 'bold' }} {...props} />,
                h4: ({ node, ...props }) => <Typography variant="subtitle1" gutterBottom sx={{ mt: 1.5, fontWeight: 'bold' }} {...props} />,
                h5: ({ node, ...props }) => <Typography variant="subtitle2" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }} {...props} />,
                h6: ({ node, ...props }) => <Typography variant="body1" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }} {...props} />,
                p: ({ node, ...props }) => <Typography variant="body1" paragraph sx={{ mb: 1.5 }} {...props} />,
                a: ({ node, ...props }) => <Link href={props.href} target="_blank" rel="noopener noreferrer" color="secondary" {...props} />,
                ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2, mb: 1.5 }} {...props} />,
                ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 2, mb: 1.5 }} {...props} />,
                li: ({ node, ...props }) => <Box component="li" sx={{ mb: 0.5 }} {...props}><Typography variant="body1" component="span">{props.children}</Typography></Box>,
                blockquote: ({ node, ...props }) => (
                    <Box
                        component="blockquote"
                        sx={{
                            borderLeft: '4px solid #ccc',
                            pl: 2,
                            py: 0.5,
                            my: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 1
                        }}
                        {...props}
                    />
                ),
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <Box sx={{ my: 2, borderRadius: 1, overflow: 'hidden' }}>
                            <SyntaxHighlighter
                                style={materialDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </Box>
                    ) : (
                        <Box
                            component="code"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                px: 0.6,
                                py: 0.2,
                                borderRadius: 1,
                                fontFamily: 'monospace',
                                fontSize: '0.9em',
                                color: 'secondary.light'
                            }}
                            {...props}
                        >
                            {children}
                        </Box>
                    );
                },
                table: ({ node, ...props }) => (
                    <TableContainer component={Paper} variant="outlined" sx={{ my: 2, bgcolor: 'transparent' }}>
                        <Table size="small" {...props} />
                    </TableContainer>
                ),
                thead: ({ node, ...props }) => <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} {...props} />,
                tbody: ({ node, ...props }) => <TableBody {...props} />,
                tr: ({ node, ...props }) => <TableRow {...props} />,
                th: ({ node, align, ...props }) => <TableCell sx={{ fontWeight: 'bold' }} align={align === 'char' ? undefined : align} {...props} />,
                td: ({ node, align, ...props }) => <TableCell align={align === 'char' ? undefined : align} {...props} />,
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
