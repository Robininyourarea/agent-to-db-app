import { InventoryAttributes } from "@/entities/inventory.entity";
import InventoryModel from "@/models/inventory.model";
import { QueryError, RepositoryError } from "@/middlewares/errorHandler";
import { DatabaseErrorEnum as d } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";

const excludeAttributes = ["created_at", "updated_at", "deleted_at"];

export class InventoryRepository {
    async getOne(id: string): Promise<InventoryAttributes> {
        try {
            const response = await InventoryModel.findOne({
                where: { uuid: id, is_active: true },
                attributes: { exclude: excludeAttributes },
            });
            if (!response) {
                throw new QueryError(m.ID_NOT_FOUND);
            }
            return response;
        } catch (error: any) {
            if (error instanceof QueryError) {
                throw new RepositoryError(d.RECORD_NOT_FOUND, error.message);
            }
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async getAll(): Promise<InventoryAttributes[]> {
        try {
            const response = await InventoryModel.findAll({
                where: { is_active: true },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async getList(limit: number, page: number): Promise<{ rows: InventoryAttributes[]; count: number }> {
        try {
            const offset = (page - 1) * limit;
            const response = await InventoryModel.findAndCountAll({
                where: { is_active: true },
                limit,
                offset,
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async create(data: InventoryAttributes, transaction?: any): Promise<InventoryAttributes> {
        try {
            const response = await InventoryModel.create(data, { transaction });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async bulkCreate(data: InventoryAttributes[], transaction?: any): Promise<InventoryAttributes[]> {
        try {
            const response = await InventoryModel.bulkCreate(data as any, { transaction });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async update(id: string, data: any, transaction?: any): Promise<[number]> {
        try {
            const response = await InventoryModel.update(data, {
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async delete(id: string, transaction?: any): Promise<number> {
        try {
            const response = await InventoryModel.destroy({
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }
}
