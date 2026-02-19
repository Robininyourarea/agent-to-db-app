import { ToolsResponse } from "../types/tools";

export const toolService = {
    async getTools(): Promise<ToolsResponse> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch("/api/tools", {
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
            console.error("Error fetching tools:", error);
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error("Request timeout - please check if the backend server is running");
            }
            throw error;
        }
    }
};
