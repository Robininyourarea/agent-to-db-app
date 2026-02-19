'use client';

import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant, // Imported for background dots/lines
    ConnectionLineType, // Imported for smooth connection lines
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode, { TableNodeData, TableNodeType } from './TableNode';
import { Box, useTheme, Paper } from '@mui/material';

// Define initial nodes based on the backend models
// SalesTransaction, SalesTransactionItem, Product, Customer, Employee, Inventory

const defaultNodes: TableNodeType[] = [
    {
        id: 'Customer',
        type: 'table',
        position: { x: 50, y: 50 },
        data: {
            label: 'Customer',
            columns: [
                { name: 'uuid', type: 'UUID', isPrimaryKey: true },
                { name: 'customer_code', type: 'VARCHAR' },
                { name: 'first_name', type: 'VARCHAR' },
                { name: 'last_name', type: 'VARCHAR' },
                { name: 'phone', type: 'VARCHAR' },
                { name: 'email', type: 'VARCHAR' },
                { name: 'address', type: 'VARCHAR' },
                { name: 'city', type: 'VARCHAR' },
                { name: 'postal_code', type: 'VARCHAR' },
                { name: 'customer_type', type: 'ENUM' },
                { name: 'is_active', type: 'BOOLEAN' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'deleted_at', type: 'TIMESTAMP' },
            ],
        },
    },
    {
        id: 'Employee',
        type: 'table',
        position: { x: 50, y: 650 },
        data: {
            label: 'Employee',
            columns: [
                { name: 'uuid', type: 'UUID', isPrimaryKey: true },
                { name: 'employee_code', type: 'VARCHAR' },
                { name: 'first_name', type: 'VARCHAR' },
                { name: 'last_name', type: 'VARCHAR' },
                { name: 'position', type: 'ENUM' },
                { name: 'phone', type: 'VARCHAR' },
                { name: 'email', type: 'VARCHAR' },
                { name: 'hire_date', type: 'DATE' },
                { name: 'is_active', type: 'BOOLEAN' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'deleted_at', type: 'TIMESTAMP' },
            ],
        },
    },
    {
        id: 'Transaction',
        type: 'table',
        position: { x: 450, y: 200 },
        data: {
            label: 'SalesTransaction',
            columns: [
                { name: 'uuid', type: 'UUID', isPrimaryKey: true },
                { name: 'customer_uuid', type: 'UUID', isForeignKey: true },
                { name: 'employee_uuid', type: 'UUID', isForeignKey: true },
                { name: 'subtotal', type: 'DECIMAL' },
                { name: 'tax_amount', type: 'DECIMAL' },
                { name: 'discount_amount', type: 'DECIMAL' },
                { name: 'total_amount', type: 'DECIMAL' },
                { name: 'payment_method', type: 'ENUM' },
                { name: 'payment_status', type: 'ENUM' },
                { name: 'sale_date', type: 'TIMESTAMP' },
                { name: 'due_date', type: 'DATE' },
                { name: 'status', type: 'ENUM' },
                { name: 'is_active', type: 'BOOLEAN' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'deleted_at', type: 'TIMESTAMP' },
            ],
        },
    },
    {
        id: 'TransactionItem',
        type: 'table',
        position: { x: 850, y: 550 },
        data: {
            label: 'SalesTransactionItem',
            columns: [
                { name: 'uuid', type: 'UUID', isPrimaryKey: true },
                { name: 'sale_uuid', type: 'UUID', isForeignKey: true },
                { name: 'product_uuid', type: 'UUID', isForeignKey: true },
                { name: 'quantity', type: 'INTEGER' },
                { name: 'unit_price', type: 'DECIMAL' },
                { name: 'discount_amount', type: 'DECIMAL' },
                { name: 'subtotal', type: 'DECIMAL' },
                { name: 'is_active', type: 'BOOLEAN' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'deleted_at', type: 'TIMESTAMP' },
            ],
        },
    },
    {
        id: 'Product',
        type: 'table',
        position: { x: 850, y: 50 },
        data: {
            label: 'Product',
            columns: [
                { name: 'uuid', type: 'UUID', isPrimaryKey: true },
                { name: 'product_code', type: 'VARCHAR' },
                { name: 'product_name', type: 'VARCHAR' },
                { name: 'category', type: 'VARCHAR' },
                { name: 'cost_price', type: 'DECIMAL' },
                { name: 'selling_price', type: 'DECIMAL' },
                { name: 'is_active', type: 'BOOLEAN' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'deleted_at', type: 'TIMESTAMP' },
            ],
        },
    },
    {
        id: 'Inventory',
        type: 'table',
        position: { x: 1250, y: 85 },
        data: {
            label: 'Inventory',
            columns: [
                { name: 'uuid', type: 'UUID', isPrimaryKey: true },
                { name: 'product_uuid', type: 'UUID', isForeignKey: true },
                { name: 'warehouse_name', type: 'VARCHAR' },
                { name: 'quantity', type: 'INTEGER' },
                { name: 'is_active', type: 'BOOLEAN' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'deleted_at', type: 'TIMESTAMP' },
            ],
        },
    },
];

const initialEdges: Edge[] = [
    { id: 'e-customer-transaction', source: 'Customer', target: 'Transaction', label: 'has many', type: 'smoothstep', animated: true, style: { stroke: '#555' } },
    { id: 'e-employee-transaction', source: 'Employee', target: 'Transaction', label: 'has many', type: 'smoothstep', animated: true, style: { stroke: '#555' } },
    { id: 'e-transaction-item', source: 'Transaction', target: 'TransactionItem', label: 'has many', type: 'smoothstep', animated: true, style: { stroke: '#555' } },
    { id: 'e-product-item', source: 'Product', target: 'TransactionItem', label: 'has many', type: 'smoothstep', animated: true, style: { stroke: '#555' } },
    { id: 'e-product-inventory', source: 'Product', target: 'Inventory', label: 'has many', type: 'smoothstep', animated: true, style: { stroke: '#555' } },
];

const nodeTypes = {
    table: TableNode,
};

export default function SchemaDiagram() {
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const theme = useTheme();

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
        [setEdges],
    );

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={{
                    backgroundColor: '#121212', // Deep dark background
                }}
                connectionLineType={ConnectionLineType.SmoothStep}
            >
                <Controls style={{ fill: '#fff', color: '#1e1e24' }} />
                <MiniMap style={{ backgroundColor: '#1e1e24' }} nodeColor="#555" maskColor="rgba(0, 0, 0, 0.6)" />
                <Background gap={20} size={1} color="#333" variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </Paper>
    );
}
