import { FieldConfigType } from "@/types/validation/validate.type";
import { EmployeePositionEnum } from "@/enum/employee.enum";
import { EntityError, FormatValidationError } from "@/middlewares/errorHandler";
import { v7 as uuidv7 } from "uuid";
import { validated } from "@/utils/validations";
import { createConfig } from "@/validations/employee.validate";
import { uuidValidateConfig } from "@/validations/uuid.validate";
import { ResponseMessageEnum as m, ResponseStatusCodeEnum as s } from "@/enum/response.enum";

export interface EmployeeAttributes {
    uuid: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    position: EmployeePositionEnum;
    phone: string;
    email: string;
    hire_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class EmployeeEntity {
    private readonly uuid: string | null;
    private readonly attributes: EmployeeAttributes;
    constructor(
        uuid: string | null = null,
        data: EmployeeAttributes | null = null,
        customConfig?: Record<string, FieldConfigType>,
    ) {
        this.uuid = uuid;
        this.attributes = this.initialize(data, customConfig);
    }

    private initialize(
        data: EmployeeAttributes | null,
        customConfig?: Record<string, FieldConfigType>,
    ): EmployeeAttributes {
        try {
            this.validate(data, customConfig);
            return {
                uuid: this.uuid ?? uuidv7(),
                employee_code: data?.employee_code,
                first_name: data?.first_name,
                last_name: data?.last_name,
                position: data?.position,
                phone: data?.phone,
                email: data?.email,
                hire_date: data?.hire_date,
                is_active: data?.is_active ?? true,
                created_at: data?.created_at,
                updated_at: data?.updated_at,
                deleted_at: data?.deleted_at,
            } as EmployeeAttributes;
        } catch (error) {
            if (error instanceof FormatValidationError) {
                throw new FormatValidationError(m.INVALID_FORMAT, error.errors, s.BAD_REQUEST);
            }
            throw new EntityError(m.ENTITY_INITAILIZE_ERROR, null);
        }
    }

    private validate(data: EmployeeAttributes | null, customConfig?: Record<string, FieldConfigType>): void {
        if (data) this.validateData(data, customConfig);
        if (this.uuid) this.validateUUID(this.uuid);
    }

    private validateData(data: EmployeeAttributes, customConfig?: Record<string, FieldConfigType>): void {
        const schema = customConfig ?? createConfig;
        const result = validated(schema, data);
        if (!result.isValid) {
            throw new FormatValidationError(m.INVALID_FORMAT, result.errors, s.BAD_REQUEST);
        }
    }

    private validateUUID(uuid: string): void {
        const result = validated(uuidValidateConfig, { uuid });
        if (!result.isValid) {
            throw new FormatValidationError(m.INVALID_FORMAT, result.errors);
        }
    }

    public getUUID(): string {
        return this.uuid ?? this.attributes.uuid;
    }

    public getAttributes(): EmployeeAttributes {
        return this.attributes;
    }
}
