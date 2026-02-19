import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';

// Styled components for the modern card look
const CardContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#1E1E24', // Slightly lighter than pure black background
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: `1px solid ${theme.palette.divider}`,
    minWidth: '240px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
        borderColor: theme.palette.primary.light,
    },
}));

const CardHeader = styled(Box)(({ theme }) => ({
    background: '#1E1E24',
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const ColumnRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: `1px solid rgba(255, 255, 255, 0.05)`,
    transition: 'background-color 0.1s',
    '&:last-child': {
        borderBottom: 'none',
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
}));

const TypeText = styled(Typography)(({ theme }) => ({
    color: '#888',
    fontSize: '0.75rem',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
}));

export interface TableColumn {
    name: string;
    type: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
}

export interface TableNodeData extends Record<string, unknown> {
    label: string;
    columns: TableColumn[];
}

export type TableNodeType = Node<TableNodeData>;

const TableNode = ({ data }: NodeProps<TableNodeType>) => {
    const tableData = data;
    const theme = useTheme();

    return (
        <CardContainer>
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: theme.palette.primary.main,
                    width: '10px',
                    height: '10px',
                    border: '2px solid #fff'
                }}
            />

            <CardHeader>
                <Typography variant="subtitle1" component="div" sx={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px', color: '#fff' }}>
                    {tableData.label}
                </Typography>
            </CardHeader>

            <Box sx={{ py: 1 }}>
                {tableData.columns.map((col) => (
                    <ColumnRow key={col.name}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {col.isPrimaryKey && (
                                <KeyIcon sx={{ fontSize: 14, color: '#FFD700' }} />
                            )}
                            {col.isForeignKey && !col.isPrimaryKey && (
                                <LinkIcon sx={{ fontSize: 14, color: '#90CAF9' }} />
                            )}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: col.isPrimaryKey ? 700 : 400,
                                    color: col.isPrimaryKey ? '#fff' : '#ddd'
                                }}
                            >
                                {col.name}
                            </Typography>
                        </Stack>
                        <TypeText>
                            {col.type}
                        </TypeText>
                    </ColumnRow>
                ))}
            </Box>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: theme.palette.primary.main,
                    width: '10px',
                    height: '10px',
                    border: '2px solid #fff'
                }}
            />
        </CardContainer>
    );
};

export default memo(TableNode);
