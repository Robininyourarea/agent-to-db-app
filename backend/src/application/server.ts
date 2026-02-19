import dotenv from "dotenv";
dotenv.config();
import { createApp } from "@/application/app";

createApp()
    .then((app) => {
        const PORT = process.env.PORT ?? 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server", err);
    });
