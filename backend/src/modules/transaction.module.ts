import { TransactionRepository } from "@/repositories/transaction.repository";
import { RepositoryError, DefaultError, FormatValidationError } from "@/middlewares/errorHandler";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { SalesTransactionAttributes, TransactionEntity } from "@/entities/transaction.entity";
import { Transaction } from "sequelize";
import { SalesTransactionCreateRequestType, SalesTransactionUpdateRequestType } from "@/types/transaction/request.type";
import { SalesTransactionResponse } from "@/types/transaction/response.type";

export class TransactionModule {
    private readonly transactionRepository: TransactionRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
    }

    public async getOne(uuid: string): Promise<SalesTransactionResponse> {
        try {
            const transactionEntity = new TransactionEntity(uuid);
            const validUUID = transactionEntity.getUUID();
            const response = await this.transactionRepository.getOne(validUUID);
            return response as unknown as SalesTransactionResponse;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ONE_TRANSACTION_FAILED);
        }
    }

    public async getAll(): Promise<SalesTransactionResponse[]> {
        try {
            const response = await this.transactionRepository.getAll();
            return response as unknown as SalesTransactionResponse[];
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ALL_TRANSACTION_FAILED);
        }
    }

    public async getList(limit: number, page: number): Promise<{ rows: SalesTransactionResponse[]; count: number }> {
        try {
            const response = await this.transactionRepository.getList(limit, page);
            return response as unknown as { rows: SalesTransactionResponse[]; count: number };
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_LIST_TRANSACTION_FAILED);
        }
    }

    public async create(data: SalesTransactionCreateRequestType, transaction?: Transaction): Promise<SalesTransactionResponse> {
        try {
            const transactionData = data as unknown as SalesTransactionAttributes;
            const transactionEntity = new TransactionEntity(null, transactionData);
            const transactionAttributes = transactionEntity.getAttributes();
            const response = await this.transactionRepository.create(transactionAttributes, transaction);
            return response as unknown as SalesTransactionResponse;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.CREATE_TRANSACTION_FAILED);
        }
    }

    public async bulkCreate(data: SalesTransactionCreateRequestType[], transaction?: Transaction): Promise<SalesTransactionResponse[]> {
        try {
            const transactionAttributesList = data.map((item) => {
                const transactionData = item as SalesTransactionAttributes;
                const transactionEntity = new TransactionEntity(null, transactionData);
                return transactionEntity.getAttributes();
            });
            const response = await this.transactionRepository.bulkCreate(transactionAttributesList, transaction);
            return response as unknown as SalesTransactionResponse[];
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.BULK_CREATE_TRANSACTION_FAILED);
        }
    }

    public async update(uuid: string, data: SalesTransactionUpdateRequestType, transaction?: Transaction): Promise<[number]> {
        try {
            const transactionData = data as unknown as SalesTransactionAttributes;
            const transactionEntity = new TransactionEntity(uuid, transactionData);
            const validUUID = transactionEntity.getUUID();
            const validData = transactionEntity.getAttributes();

            const response = await this.transactionRepository.update(validUUID, validData, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.UPDATE_TRANSACTION_FAILED);
        }
    }

    public async delete(uuid: string, transaction?: Transaction): Promise<any> {
        try {
            const transactionEntity = new TransactionEntity(uuid);
            const validUUID = transactionEntity.getUUID();

            const response = await this.transactionRepository.delete(validUUID, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.DELETE_TRANSACTION_FAILED);
        }
    }
}
