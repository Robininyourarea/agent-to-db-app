import { InventoryRepository } from "@/repositories/inventory.repository";
import { RepositoryError, DefaultError, FormatValidationError } from "@/middlewares/errorHandler";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { InventoryAttributes, InventoryEntity } from "@/entities/inventory.entity";
import { Transaction } from "sequelize";
import { InventoryCreateRequestType, InventoryUpdateRequestType } from "@/types/inventory/request.type";
import { InventoryResponse } from "@/types/inventory/response.type";

export class InventoryModule {
    private readonly inventoryRepository: InventoryRepository;

    constructor() {
        this.inventoryRepository = new InventoryRepository();
    }

    public async getOne(uuid: string): Promise<InventoryResponse> {
        try {
            const inventoryEntity = new InventoryEntity(uuid);
            const validUUID = inventoryEntity.getUUID();
            const response = await this.inventoryRepository.getOne(validUUID);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ONE_INVENTORY_FAILED);
        }
    }

    public async getAll(): Promise<InventoryResponse[]> {
        try {
            const response = await this.inventoryRepository.getAll();
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ALL_INVENTORY_FAILED);
        }
    }

    public async getList(limit: number, page: number): Promise<{ rows: InventoryResponse[]; count: number }> {
        try {
            const response = await this.inventoryRepository.getList(limit, page);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_LIST_INVENTORY_FAILED);
        }
    }

    public async create(data: InventoryCreateRequestType, transaction?: Transaction): Promise<InventoryResponse> {
        try {
            const inventoryData = data as unknown as InventoryAttributes;
            const inventoryEntity = new InventoryEntity(null, inventoryData);
            const inventoryAttributes = inventoryEntity.getAttributes();
            const response = await this.inventoryRepository.create(inventoryAttributes, transaction);
            return response as unknown as InventoryResponse;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.CREATE_INVENTORY_FAILED);
        }
    }

    public async bulkCreate(data: InventoryCreateRequestType[], transaction?: Transaction): Promise<InventoryResponse[]> {
        try {
            const inventoryAttributesList = data.map((item) => {
                const inventoryData = item as InventoryAttributes;
                const inventoryEntity = new InventoryEntity(null, inventoryData);
                return inventoryEntity.getAttributes();
            });
            const response = await this.inventoryRepository.bulkCreate(inventoryAttributesList, transaction);
            return response as unknown as InventoryResponse[];
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.BULK_CREATE_INVENTORY_FAILED);
        }
    }

    public async update(uuid: string, data: InventoryUpdateRequestType, transaction?: Transaction): Promise<[number]> {
        try {
            const inventoryData = data as unknown as InventoryAttributes;
            const inventoryEntity = new InventoryEntity(uuid, inventoryData);
            const validUUID = inventoryEntity.getUUID();
            const validData = inventoryEntity.getAttributes();

            const response = await this.inventoryRepository.update(validUUID, validData, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.UPDATE_INVENTORY_FAILED);
        }
    }

    public async delete(uuid: string, transaction?: Transaction): Promise<any> {
        try {
            const inventoryEntity = new InventoryEntity(uuid);
            const validUUID = inventoryEntity.getUUID();

            const response = await this.inventoryRepository.delete(validUUID, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.DELETE_INVENTORY_FAILED);
        }
    }
}
