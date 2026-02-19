export interface Tool {
    name: string;
    description: string;
    category?: string;
}

export interface ToolsResponse {
    total_tools: number;
    categories: Record<string, Tool[]>;
    all_tools: Tool[];
}
