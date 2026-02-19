import { EmployeeAttributes } from "@/entities/employee.entity";
import EmployeeModel from "@/models/employee.model";
import { QueryError, RepositoryError } from "@/middlewares/errorHandler";
import { DatabaseErrorEnum as d } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { Op, Transaction } from "sequelize";

const excludeAttributes = ["created_at", "updated_at", "deleted_at"];

export class EmployeeRepository {
    async getOne(id: string): Promise<EmployeeModel> {
        try {
            const response = await EmployeeModel.findOne({
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

    async getAll(): Promise<EmployeeModel[]> {
        try {
            const response = await EmployeeModel.findAll({
                where: { is_active: true },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getList(limit: number, page: number): Promise<{ rows: EmployeeModel[]; count: number }> {
        try {
            const offset = (page - 1) * limit;
            const { rows, count } = await EmployeeModel.findAndCountAll({
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

    async getByName(name: string): Promise<EmployeeModel[]> {
        try {
            const response = await EmployeeModel.findAll({
                where: {
                    first_name: { [Op.like]: `%${name}%` },
                    is_active: true,
                },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async create(data: EmployeeAttributes, transaction?: Transaction): Promise<EmployeeModel> {
        try {
            const response = await EmployeeModel.create(data, { transaction });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async bulkCreate(data: EmployeeAttributes[], transaction?: Transaction): Promise<EmployeeModel[]> {
        try {
            const response = await EmployeeModel.bulkCreate(data, { transaction });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async update(id: string, data: Partial<EmployeeAttributes>, transaction?: Transaction): Promise<[number]> {
        try {
            const response = await EmployeeModel.update(data, {
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
            const response = await EmployeeModel.destroy({
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }
}
