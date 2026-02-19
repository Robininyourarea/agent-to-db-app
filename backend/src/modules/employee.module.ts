import { EmployeeRepository } from "@/repositories/employee.repository";
import { RepositoryError, DefaultError, FormatValidationError } from "@/middlewares/errorHandler";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { EmployeeAttributes, EmployeeEntity } from "@/entities/employee.entity";
import { Transaction } from "sequelize";
import { EmployeeCreateRequestType, EmployeeUpdateRequestType } from "@/types/employee/request.type";
import { EmployeeResponse } from "@/types/employee/response.type";

export class EmployeeModule {
    private readonly employeeRepository: EmployeeRepository;

    constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    public async getOne(uuid: string): Promise<EmployeeResponse> {
        try {
            const employeeEntity = new EmployeeEntity(uuid);
            const validUUID = employeeEntity.getUUID();
            const response = await this.employeeRepository.getOne(validUUID);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ONE_EMPLOYEE_FAILED);
        }
    }

    public async getByName(name: string): Promise<EmployeeResponse[]> {
        try {
            const response = await this.employeeRepository.getByName(name);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_BY_NAME_EMPLOYEE_FAILED);
        }
    }

    public async getAll(): Promise<EmployeeResponse[]> {
        try {
            const response = await this.employeeRepository.getAll();
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_ALL_EMPLOYEE_FAILED);
        }
    }

    public async getList(limit: number, page: number): Promise<{ rows: EmployeeResponse[]; count: number }> {
        try {
            const response = await this.employeeRepository.getList(limit, page);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_LIST_EMPLOYEE_FAILED);
        }
    }

    public async create(data: EmployeeCreateRequestType, transaction?: Transaction): Promise<EmployeeResponse> {
        try {
            const employeeData = data as unknown as EmployeeAttributes;
            const employeeEntity = new EmployeeEntity(null, employeeData);
            const employeeAttributes = employeeEntity.getAttributes();
            const response = await this.employeeRepository.create(employeeAttributes, transaction);
            return response as unknown as EmployeeResponse;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.CREATE_EMPLOYEE_FAILED);
        }
    }

    public async bulkCreate(data: EmployeeCreateRequestType[], transaction?: Transaction): Promise<EmployeeResponse[]> {
        try {
            const employeeAttributesList = data.map((item) => {
                const employeeData = item as EmployeeAttributes;
                const employeeEntity = new EmployeeEntity(null, employeeData);
                return employeeEntity.getAttributes();
            });
            const response = await this.employeeRepository.bulkCreate(employeeAttributesList, transaction);
            return response as unknown as EmployeeResponse[];
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.BULK_CREATE_EMPLOYEE_FAILED);
        }
    }

    public async update(uuid: string, data: EmployeeUpdateRequestType, transaction?: Transaction): Promise<[number]> {
        try {
            const employeeData = data as unknown as EmployeeAttributes;
            const employeeEntity = new EmployeeEntity(uuid, employeeData);
            const validUUID = employeeEntity.getUUID();
            const validData = employeeEntity.getAttributes();

            const response = await this.employeeRepository.update(validUUID, validData, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.UPDATE_EMPLOYEE_FAILED);
        }
    }

    public async delete(uuid: string, transaction?: Transaction): Promise<any> {
        try {
            const employeeEntity = new EmployeeEntity(uuid);
            const validUUID = employeeEntity.getUUID();

            const response = await this.employeeRepository.delete(validUUID, transaction);
            return response;
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            if (error instanceof FormatValidationError) {
                throw new DefaultError(e.VALIDATION_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.DELETE_EMPLOYEE_FAILED);
        }
    }
}
