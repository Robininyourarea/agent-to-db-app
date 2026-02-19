'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert, Chip, Stack } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ExtensionIcon from '@mui/icons-material/Extension';
import { toolService } from '../../services/toolService';
import { Tool } from '../../types/tools';

export default function ToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const data = await toolService.getTools();
                setTools(data.all_tools);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tools');
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, []);

    const formatDescription = (description: string) => {
        if (!description) return '';
        return description.split('\n')[0];
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            p: 3,
            bgcolor: 'background.default'
        }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Box
                    sx={{
                        p: 1,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #18181a 0%, #333 100%)',
                        display: 'flex',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <TuneIcon sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight={600} sx={{ color: '#fff' }}>
                        Tools
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Browse available AI tools and capabilities
                    </Typography>
                </Box>
            </Stack>

            <Grid container spacing={3}>
                {tools.map((tool) => (
                    <Grid item xs={12} sm={6} md={4} key={tool.name}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4
                            },
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper'
                        }}>
                            <CardContent sx={{
                                flexGrow: 1,
                                p: 2,
                                '&:last-child': { pb: 2 }
                            }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                    <Box sx={{
                                        p: 0.5,
                                        borderRadius: 1,
                                        bgcolor: 'action.hover',
                                        color: 'text.secondary',
                                        display: 'flex',
                                    }}>
                                        <ExtensionIcon fontSize="small" />
                                    </Box>

                                    <Typography variant="subtitle1" component="div" fontWeight={600} sx={{ flexGrow: 1, lineHeight: 1.2 }}>
                                        {tool.name}
                                    </Typography>

                                    {tool.category && (
                                        <Chip
                                            label={tool.category}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.75rem',
                                                textTransform: 'capitalize',
                                                borderColor: 'divider'
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Typography variant="body2" color="text.secondary" sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.4,
                                    minHeight: '2.8em'
                                }}>
                                    {formatDescription(tool.description)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
