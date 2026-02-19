import { CustomerRepository } from "@/repositories/customer.repository";
import { RepositoryError, DefaultError, FormatValidationError } from "@/middlewares/errorHandler";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { CustomerAttributes, CustomerEntity } from "@/entities/customer.entity";
import { Transaction } from "sequelize";
import { CustomerCreateRequestType, CustomerUpdateRequestType } from "@/types/customer/request.type";
import { CustomerListResponse, CustomerResponse } from "@/types/customer/response.type";

export class CustomerModule {
    private readonly customerRepository: CustomerRepository;

    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    public async getOne(uuid: string): Promise<CustomerResponse> {
        try {
            const customerEntity = new CustomerEntity(uuid);
            const validUUID = customerEntity.getUUID();
            const response = await this.customerRepository.getOne(validUUID);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ONE_CUSTOMER_FAILED);
        }
    }

    public async getByName(name: string): Promise<CustomerResponse[]> {
        try {
            const response = await this.customerRepository.getByName(name);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_BY_NAME_CUSTOMER_FAILED);
        }
    }

    public async getAll(): Promise<CustomerResponse[]> {
        try {
            const response = await this.customerRepository.getAll();
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ALL_CUSTOMER_FAILED);
        }
    }

    public async getList(limit: number, page: number): Promise<CustomerListResponse> {
        try {
            const response = await this.customerRepository.getList(limit, page);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_LIST_CUSTOMER_FAILED);
        }
    }

    public async create(data: CustomerCreateRequestType, transaction?: Transaction): Promise<CustomerResponse> {
        try {
            const customerData = data as CustomerAttributes;
            const customerEntity = new CustomerEntity(null, customerData);
            const validData = customerEntity.getAttributes();

            const response = await this.customerRepository.create(validData, transaction);
            return response as unknown as CustomerResponse;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.CREATE_CUSTOMER_FAILED);
        }
    }

    public async bulkCreate(data: CustomerCreateRequestType[], transaction?: Transaction): Promise<CustomerResponse[]> {
        try {
            const customerAttributesList = data.map((item) => {
                const customerData = item as CustomerAttributes;
                const customerEntity = new CustomerEntity(null, customerData);
                return customerEntity.getAttributes();
            });
            const response = await this.customerRepository.bulkCreate(customerAttributesList, transaction);
            return response as unknown as CustomerResponse[];
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.BULK_CREATE_CUSTOMER_FAILED);
        }
    }

    public async update(uuid: string, data: CustomerUpdateRequestType, transaction?: Transaction): Promise<[number]> {
        try {
            const customerData = data as CustomerAttributes;
            const customerEntity = new CustomerEntity(uuid, customerData);
            const validUUID = customerEntity.getUUID();
            const validData = customerEntity.getAttributes();

            const response = await this.customerRepository.update(validUUID, validData, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.UPDATE_CUSTOMER_FAILED);
        }
    }

    public async delete(uuid: string, transaction?: Transaction): Promise<any> {
        try {
            const customerEntity = new CustomerEntity(uuid);
            const validUUID = customerEntity.getUUID();

            const response = await this.customerRepository.delete(validUUID, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.DELETE_CUSTOMER_FAILED);
        }
    }
}
