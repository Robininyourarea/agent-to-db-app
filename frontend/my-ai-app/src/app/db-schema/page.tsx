import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import SchemaDiagram from '../../components/schema/SchemaDiagram';
import StorageIcon from '@mui/icons-material/Storage';

export default function DBSchemaPage() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            pt: 2,
            pb: 3,
            px: 3
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
                    <StorageIcon sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight={600} sx={{ color: '#fff' }}>
                        Database Schema
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Visual representation of the application's data models and relationships
                    </Typography>
                </Box>
            </Stack>

            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <SchemaDiagram />
            </Box>
        </Box>
    );
}
