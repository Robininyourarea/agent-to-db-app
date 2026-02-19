export interface Session {
    session_id: string;
    created_at: string;
    updated_at: string;
    preview: string;
    message_count: number;
}

export interface SessionsResponse {
    sessions: Session[];
    count: number;
}

export interface SessionMessage {
    content: string;
    type: 'human' | 'ai';
}

export interface SessionHistory {
    messages: SessionMessage[];
}

export interface ChatRequest {
    message: string;
    session_id?: string;
}

export interface ChatResponse {
    response: string;
    session_id?: string;
}
