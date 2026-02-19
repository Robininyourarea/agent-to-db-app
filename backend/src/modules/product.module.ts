import { ProductRepository } from "@/repositories/product.repository";
import { RepositoryError, DefaultError, FormatValidationError } from "@/middlewares/errorHandler";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { ProductAttributes, ProductEntity } from "@/entities/product.entity";
import { Transaction } from "sequelize";
import { ProductCreateRequestType, ProductUpdateRequestType } from "@/types/product/request.type";
import { ProductResponse } from "@/types/product/response.type";

export class ProductModule {
    private readonly productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    public async getOne(uuid: string): Promise<ProductResponse> {
        try {
            const productEntity = new ProductEntity(uuid);
            const validUUID = productEntity.getUUID();
            const response = await this.productRepository.getOne(validUUID);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ONE_PRODUCT_FAILED);
        }
    }

    public async getByName(name: string): Promise<ProductResponse[]> {
        try {
            const response = await this.productRepository.getByName(name);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_BY_NAME_PRODUCT_FAILED);
        }
    }

    public async getAll(): Promise<ProductResponse[]> {
        try {
            const response = await this.productRepository.getAll();
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ALL_PRODUCT_FAILED);
        }
    }

    public async getList(limit: number, page: number): Promise<{ rows: ProductResponse[]; count: number }> {
        try {
            const response = await this.productRepository.getList(limit, page);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_LIST_PRODUCT_FAILED);
        }
    }

    public async create(data: ProductCreateRequestType, transaction?: Transaction): Promise<ProductResponse> {
        try {
            const productData = data as unknown as ProductAttributes;
            const productEntity = new ProductEntity(null, productData);
            const productAttributes = productEntity.getAttributes();
            const response = await this.productRepository.create(productAttributes, transaction);
            return response as unknown as ProductResponse;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.CREATE_PRODUCT_FAILED);
        }
    }

    public async bulkCreate(data: ProductCreateRequestType[], transaction?: Transaction): Promise<ProductResponse[]> {
        try {
            const productAttributesList = data.map((item) => {
                const productData = item as ProductAttributes;
                const productEntity = new ProductEntity(null, productData);
                return productEntity.getAttributes();
            });
            const response = await this.productRepository.bulkCreate(productAttributesList, transaction);
            return response as unknown as ProductResponse[];
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.BULK_CREATE_PRODUCT_FAILED);
        }
    }

    public async update(uuid: string, data: ProductUpdateRequestType, transaction?: Transaction): Promise<[number]> {
        try {
            const productData = data as unknown as ProductAttributes;
            const productEntity = new ProductEntity(uuid, productData);
            const validUUID = productEntity.getUUID();
            const validData = productEntity.getAttributes();

            const response = await this.productRepository.update(validUUID, validData, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.UPDATE_PRODUCT_FAILED);
        }
    }

    public async delete(uuid: string, transaction?: Transaction): Promise<any> {
        try {
            const productEntity = new ProductEntity(uuid);
            const validUUID = productEntity.getUUID();

            const response = await this.productRepository.delete(validUUID, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.DELETE_PRODUCT_FAILED);
        }
    }
}
