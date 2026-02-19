import CustomerModel from "@/models/customer.model";
import ProductModel from "@/models/product.model";
import InventoryModel from "@/models/inventory.model";
import EmployeeModel from "@/models/employee.model";
import SalesTransactionModel from "@/models/transaction.model";
import SalesTransactionItemModel from "@/models/transactionItem.model";

export {
    CustomerModel,
    ProductModel,
    InventoryModel,
    EmployeeModel,
    SalesTransactionModel,
    SalesTransactionItemModel,
};

export interface AllModels {
    Customer: typeof CustomerModel;
    Product: typeof ProductModel;
    Inventory: typeof InventoryModel;
    Employee: typeof EmployeeModel;
    SalesTransaction: typeof SalesTransactionModel;
    SalesTransactionItem: typeof SalesTransactionItemModel;
}

export default AllModels;
