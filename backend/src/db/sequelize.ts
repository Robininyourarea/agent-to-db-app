import { Dialect, Sequelize } from "sequelize";
import { logger } from "@/utils/logger";

const database: string = String(process.env.SQL_DATABASE);
const username: string = String(process.env.SQL_USERNAME);
const password: string = String(process.env.SQL_PASSWORD);
const host: string = String(process.env.SQL_HOST);
const port: number = Number(process.env.SQL_PORT) || 5432;
const dialect: Dialect = process.env.SQL_DIALECT as Dialect;

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    logging: false,
});

export async function initSequelize() {
    try {
        logger.debug("Database authenticate");
        await sequelize.authenticate();
        logger.info("Connection has been established successfully.");

        // Initialize associations
        const {
            CustomerModel,
            ProductModel,
            InventoryModel,
            EmployeeModel,
            SalesTransactionModel,
            SalesTransactionItemModel,
        } = require("@/models/allModels");

        const models = {
            Customer: CustomerModel,
            Product: ProductModel,
            Inventory: InventoryModel,
            Employee: EmployeeModel,
            SalesTransaction: SalesTransactionModel,
            SalesTransactionItem: SalesTransactionItemModel,
        };

        Object.values(models).forEach((model: any) => {
            if (model.associate) {
                model.associate(models);
            }
        });

        const syncMode = process.env.DB_SYNC_MODE || (process.env.NODE_ENV === "development" ? "safe" : "none");

        switch (syncMode) {
            case "force":
                logger.warn("⚠️  WARNING: DB_SYNC_MODE=force will DROP ALL TABLES and recreate them!");
                logger.warn("⚠️  This will DELETE ALL DATA in the database!");
                logger.warn("⚠️  Proceeding in 60 seconds...");

                await new Promise((resolve) => setTimeout(resolve, 60000));
                await sequelize.sync({ force: true });
                logger.info("Database tables dropped and recreated from model definitions.");
                break;

            case "alter":
                logger.warn("⚠️  WARNING: DB_SYNC_MODE=alter may cause data loss!");
                logger.warn("⚠️  This will alter existing tables to match model definitions.");
                logger.warn("⚠️  Consider using migrations for production-like environments.");

                await sequelize.sync({ alter: true });
                logger.info("Database tables altered to match model definitions.");
                break;

            case "safe":
                await sequelize.sync();
                logger.info("Database synced (safe mode - no alterations to existing tables).");
                break;

            case "none":
                logger.info("Database sync skipped (DB_SYNC_MODE=none).");
                break;

            default:
                logger.warn(`Unknown DB_SYNC_MODE: ${syncMode}. Defaulting to 'none'.`);
                logger.info("Database sync skipped.");
                break;
        }
    } catch (error) {
        logger.error("Unable to connect to the database:", error);
    }
}

export default sequelize;
