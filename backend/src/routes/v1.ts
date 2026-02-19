import { CustomerController } from "@/controllers/customer.controller";
import { CustomerModule } from "@/modules/customer.module";
import { ProductController } from "@/controllers/product.controller";
import { ProductModule } from "@/modules/product.module";
import { InventoryController } from "@/controllers/inventory.controller";
import { InventoryModule } from "@/modules/inventory.module";
import { EmployeeController } from "@/controllers/employee.controller";
import { EmployeeModule } from "@/modules/employee.module";
import { TransactionController } from "@/controllers/transaction.controller";
import { TransactionModule } from "@/modules/transaction.module";
import { AnalyticsController } from "@/controllers/analytics.controller";
import { AnalyticsModule } from "@/modules/analytics.module";

import express from "express";

const router = express.Router();

const customerModule = new CustomerModule();
const customerController = new CustomerController(customerModule);
const productModule = new ProductModule();
const productController = new ProductController(productModule);
const inventoryModule = new InventoryModule();
const inventoryController = new InventoryController(inventoryModule);
const employeeModule = new EmployeeModule();
const employeeController = new EmployeeController(employeeModule);
const transactionModule = new TransactionModule();
const transactionController = new TransactionController(transactionModule);const analyticsModule = new AnalyticsModule();
const analyticsController = new AnalyticsController(analyticsModule);

router.use("/customers", customerController.router);
router.use("/products", productController.router);
router.use("/inventories", inventoryController.router);
router.use("/employees", employeeController.router);
router.use("/transactions", transactionController.router);
router.use("/analytics", analyticsController.router);

export default router;
