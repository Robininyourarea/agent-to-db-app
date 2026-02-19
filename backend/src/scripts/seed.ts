import "dotenv/config";
import { faker } from "@faker-js/faker";
import sequelize from "@/db/sequelize";
import AllModels, {
    CustomerModel,
    EmployeeModel,
    ProductModel,
    InventoryModel,
    SalesTransactionModel,
    SalesTransactionItemModel,
} from "@/models/allModels";
import { CustomerTypeEnum } from "@/enum/customer.enum";
import { EmployeePositionEnum } from "@/enum/employee.enum";
import { ProductCategoryEnum } from "@/enum/product.enum";
import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        // Sync models first to ensure tables exist
        await sequelize.sync({ force: true }); // WARNING: This drops all tables!
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

const seedEmployees = async () => {
    console.log("Seeding Employees...");
    const employees = [];
    for (let i = 0; i < 10; i++) {
        employees.push({
            employee_code: `EMP${faker.string.numeric(5)}`,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            position: faker.helpers.enumValue(EmployeePositionEnum),
            phone: faker.phone.number({ style: 'national' }).slice(0, 20), // Truncate to be safe
            email: faker.internet.email(),
            hire_date: faker.date.past(),
            is_active: faker.datatype.boolean(),
        });
    }
    await EmployeeModel.bulkCreate(employees);
    console.log("Employees seeded.");
};

const seedCustomers = async () => {
    console.log("Seeding Customers...");
    const customers = [];
    for (let i = 0; i < 50; i++) {
        customers.push({
            customer_code: `CUST${faker.string.numeric(5)}`,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            phone: faker.phone.number({ style: 'national' }).slice(0, 20),
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            postal_code: faker.location.zipCode().slice(0, 20),
            customer_type: faker.helpers.enumValue(CustomerTypeEnum),
            is_active: faker.datatype.boolean(),
        });
    }
    await CustomerModel.bulkCreate(customers);
    console.log("Customers seeded.");
};

const seedProductsAndInventory = async () => {
    console.log("Seeding Products and Inventory...");
    const products = [];
    for (let i = 0; i < 20; i++) {
        products.push({
            product_code: `PROD${faker.string.numeric(5)}`,
            product_name: faker.commerce.productName(),
            category: faker.helpers.enumValue(ProductCategoryEnum),
            cost_price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
            selling_price: parseFloat(faker.commerce.price({ min: 20, max: 200 })),
            is_active: true,
        });
    }
    const createdProducts = await ProductModel.bulkCreate(products);
    console.log("Products seeded.");

    console.log("Seeding Inventory...");
    const inventory = [];
    for (const product of createdProducts) {
        inventory.push({
            product_uuid: product.uuid,
            warehouse_name: faker.location.city() + " Warehouse",
            quantity: faker.number.int({ min: 0, max: 200 }),
            is_active: true,
        });
    }
    await InventoryModel.bulkCreate(inventory);
    console.log("Inventory seeded.");
};

const seedTransactions = async () => {
    console.log("Seeding Transactions...");
    const customers = await CustomerModel.findAll();
    const employees = await EmployeeModel.findAll();
    const products = await ProductModel.findAll();

    if (customers.length === 0 || employees.length === 0 || products.length === 0) {
        console.warn("Skipping transactions due to missing dependencies.");
        return;
    }

    for (let i = 0; i < 100; i++) { // Generate 100 transactions
        const customer = faker.helpers.arrayElement(customers);
        const employee = faker.helpers.arrayElement(employees);

        // Randomly select 1-5 items
        const numItems = faker.number.int({ min: 1, max: 5 });
        let subtotal = 0;
        const items = [];

        for (let j = 0; j < numItems; j++) {
            const product = faker.helpers.arrayElement(products);
            const quantity = faker.number.int({ min: 1, max: 5 });
            const unitPrice = product.selling_price;
            const discount = 0; // Keeping it simple
            const itemSubtotal = quantity * unitPrice;

            subtotal += itemSubtotal;
            items.push({
                product_uuid: product.uuid,
                quantity,
                unit_price: unitPrice,
                discount_amount: discount,
                subtotal: itemSubtotal,
            });
        }

        const taxAmount = subtotal * 0.07; // 7% tax
        const discountAmount = 0;
        const totalAmount = subtotal + taxAmount - discountAmount;

        const transaction = await SalesTransactionModel.create({
            sale_date: faker.date.recent(),
            customer_uuid: customer.uuid,
            employee_uuid: employee.uuid,
            subtotal,
            tax_amount: taxAmount,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            payment_method: faker.helpers.enumValue(PaymentMethodEnum),
            payment_status: faker.helpers.enumValue(PaymentStatusEnum),
            due_date: faker.date.future(),
            status: faker.helpers.enumValue(TransactionStatusEnum),
        });

        // Create items for this transaction
        const transactionItems = items.map(item => ({
            ...item,
            sale_uuid: transaction.uuid,
        }));
        await SalesTransactionItemModel.bulkCreate(transactionItems);
    }
    console.log("Transactions seeded.");
};

const seed = async () => {
    try {
        await connectDB();

        // Seed in order of dependencies
        await seedEmployees();
        await seedCustomers();
        await seedProductsAndInventory();
        await seedTransactions();

        console.log("All data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
