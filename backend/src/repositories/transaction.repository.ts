import { SalesTransactionAttributes } from "@/entities/transaction.entity";
import SalesTransactionModel from "@/models/transaction.model";
import CustomerModel from "@/models/customer.model";
import EmployeeModel from "@/models/employee.model";
import SalesTransactionItemModel from "@/models/transactionItem.model";
import { QueryError, RepositoryError } from "@/middlewares/errorHandler";
import { DatabaseErrorEnum as d } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { Transaction } from "sequelize";

const customerAttributes = ["uuid", "customer_code", "first_name", "last_name"];
const employeeAttributes = ["uuid", "employee_code", "first_name", "last_name", "position"];
const itemAttributes = ["uuid", "sale_uuid", "product_uuid", "quantity", "unit_price", "discount_amount", "subtotal"];
const excludeAttributes = ["created_at", "updated_at", "deleted_at"];
export class TransactionRepository {
    async getOne(id: string): Promise<SalesTransactionModel> {
        try {
            const response = await SalesTransactionModel.findOne({
                where: { uuid: id },
                include: [
                    { model: SalesTransactionItemModel, as: "items", attributes: itemAttributes },
                    { model: CustomerModel, as: "customer", attributes: customerAttributes },
                    { model: EmployeeModel, as: "employee", attributes: employeeAttributes },
                ],
                attributes: { exclude: excludeAttributes },
            });
            if (!response) throw new QueryError(d.RECORD_NOT_FOUND, m.ID_NOT_FOUND);
            return response;
        } catch (error) {
            if (error instanceof QueryError) {
                throw new RepositoryError(error.errors, error.message);
            }
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getAll(): Promise<SalesTransactionModel[]> {
        try {
            const response = await SalesTransactionModel.findAll({
                include: [
                    { model: SalesTransactionItemModel, as: "items", attributes: itemAttributes },
                    { model: CustomerModel, as: "customer", attributes: customerAttributes },
                    { model: EmployeeModel, as: "employee", attributes: employeeAttributes },
                ],
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getList(limit: number, page: number): Promise<{ rows: SalesTransactionModel[]; count: number }> {
        try {
            const offset = (page - 1) * limit;
            const { rows, count } = await SalesTransactionModel.findAndCountAll({
                limit,
                offset,
                include: ["customer", "employee"],
            });
            return { rows, count };
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async create(data: SalesTransactionAttributes, transaction?: Transaction): Promise<SalesTransactionModel> {
        try {
            const response = await SalesTransactionModel.create(data, { transaction });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async bulkCreate(data: SalesTransactionAttributes[], transaction?: Transaction): Promise<SalesTransactionModel[]> {
        try {
            const response = await SalesTransactionModel.bulkCreate(data, { transaction });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async update(id: string, data: Partial<SalesTransactionAttributes>, transaction?: Transaction): Promise<[number]> {
        try {
            const response = await SalesTransactionModel.update(data, {
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async delete(id: string, transaction?: Transaction): Promise<number> {
        try {
            const response = await SalesTransactionModel.destroy({
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }
}
