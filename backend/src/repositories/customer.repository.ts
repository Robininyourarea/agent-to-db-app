import { CustomerAttributes } from "@/entities/customer.entity";
import CustomerModel from "@/models/customer.model";
import { QueryError, RepositoryError } from "@/middlewares/errorHandler";
import { DatabaseErrorEnum as d } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { Op, Transaction, Sequelize } from "sequelize";

const excludeAttributes = ["created_at", "updated_at", "deleted_at"];

export class CustomerRepository {
    async getOne(id: string): Promise<CustomerModel> {
        try {
            const response = await CustomerModel.findOne({
                where: { uuid: id, is_active: true },
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

    async getAll(): Promise<CustomerModel[]> {
        try {
            const response = await CustomerModel.findAll({
                where: { is_active: true },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getList(limit: number, page: number): Promise<{ rows: CustomerModel[]; count: number }> {
        try {
            const offset = (page - 1) * limit;
            const { rows, count } = await CustomerModel.findAndCountAll({
                where: { is_active: true },
                limit,
                offset,
                attributes: { exclude: excludeAttributes },
            });
            return { rows, count };
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getByName(name: string): Promise<CustomerModel[]> {
        try {
            const response = await CustomerModel.findAll({
                where: {
                    is_active: true,
                    [Op.or]: [
                        { first_name: { [Op.like]: `%${name}%` } },
                        { last_name: { [Op.like]: `%${name}%` } },
                        Sequelize.where(
                            Sequelize.fn("CONCAT", Sequelize.col("first_name"), " ", Sequelize.col("last_name")),
                            { [Op.like]: `%${name}%` }
                        ),
                    ],
                },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async create(data: CustomerAttributes, transaction?: Transaction): Promise<CustomerModel> {
        try {
            const response = await CustomerModel.create(data, { transaction });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async bulkCreate(data: CustomerAttributes[], transaction?: Transaction): Promise<CustomerModel[]> {
        try {
            const response = await CustomerModel.bulkCreate(data, { transaction });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async update(id: string, data: Partial<CustomerAttributes>, transaction?: Transaction): Promise<[number]> {
        try {
            const response = await CustomerModel.update(data, {
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
            const response = await CustomerModel.destroy({
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }
}
