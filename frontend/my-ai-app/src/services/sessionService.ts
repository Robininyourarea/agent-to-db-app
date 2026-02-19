import { SessionsResponse, SessionHistory, ChatRequest, ChatResponse } from "../types/session";

export const sessionService = {
    async getSessions(): Promise<SessionsResponse> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch("/api/sessions", {
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching sessions:", error);
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error("Request timeout - please check if the backend server is running");
            }
            throw error;
        }
    },

    async getSessionById(sessionId: string): Promise<SessionHistory> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`/api/sessions/${sessionId}`, {
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Session not found");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching session ${sessionId}:`, error);
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error("Request timeout - please check if the backend server is running");
            }
            throw error;
        }
    },

    async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    },
};
