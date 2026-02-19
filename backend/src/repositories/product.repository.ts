import { ProductAttributes } from "@/entities/product.entity";
import ProductModel from "@/models/product.model";
import { QueryError, RepositoryError } from "@/middlewares/errorHandler";
import { DatabaseErrorEnum as d } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { Op } from "sequelize";

const excludeAttributes = ["created_at", "updated_at", "deleted_at"];

export class ProductRepository {
    async getOne(id: string): Promise<ProductAttributes> {
        try {
            const response = await ProductModel.findOne({
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

    async getAll(): Promise<ProductAttributes[]> {
        try {
            const response = await ProductModel.findAll({
                where: { is_active: true },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async getList(limit: number, page: number): Promise<{ rows: ProductAttributes[]; count: number }> {
        try {
            const offset = (page - 1) * limit;
            const response = await ProductModel.findAndCountAll({
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

    async getByName(name: string): Promise<ProductAttributes[]> {
        try {
            const response = await ProductModel.findAll({
                where: {
                    product_name: { [Op.like]: `%${name}%` },
                    is_active: true,
                },
                attributes: { exclude: excludeAttributes },
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async create(data: ProductAttributes, transaction?: any): Promise<ProductAttributes> {
        try {
            const response = await ProductModel.create(data, { transaction });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async bulkCreate(data: ProductAttributes[], transaction?: any): Promise<ProductAttributes[]> {
        try {
            const response = await ProductModel.bulkCreate(data as any, { transaction });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }

    async update(id: string, data: any, transaction?: any): Promise<[number]> {
        try {
            const response = await ProductModel.update(data, {
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
            const response = await ProductModel.destroy({
                where: { uuid: id },
                transaction,
            });
            return response;
        } catch (error: any) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, error.message);
        }
    }
}
