import { FieldConfigType } from "@/types/validation/validate.type";
import { CustomerTypeEnum } from "@/enum/customer.enum";
import { EntityError, FormatValidationError } from "@/middlewares/errorHandler";
import { v7 as uuidv7 } from "uuid";
import { validated } from "@/utils/validations";
import { createConfig } from "@/validations/customer.validate";
import { uuidValidateConfig } from "@/validations/uuid.validate";
import { ResponseMessageEnum as m, ResponseStatusCodeEnum as s } from "@/enum/response.enum";

export interface CustomerAttributes {
    uuid: string;
    customer_code: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
    customer_type: CustomerTypeEnum;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class CustomerEntity {
    private readonly uuid: string | null;
    private readonly attributes: CustomerAttributes;
    constructor(
        uuid: string | null = null,
        data: CustomerAttributes | null = null,
        customConfig?: Record<string, FieldConfigType>,
    ) {
        this.uuid = uuid;
        this.attributes = this.initialize(data, customConfig);
    }

    private initialize(
        data: CustomerAttributes | null,
        customConfig?: Record<string, FieldConfigType>,
    ): CustomerAttributes {
        try {
            this.validate(data, customConfig);
            return {
                uuid: this.uuid ?? uuidv7(),
                customer_code: data?.customer_code,
                first_name: data?.first_name,
                last_name: data?.last_name,
                phone: data?.phone,
                email: data?.email,
                address: data?.address,
                city: data?.city,
                postal_code: data?.postal_code,
                customer_type: data?.customer_type,
            } as CustomerAttributes;
        } catch (error) {
            if (error instanceof FormatValidationError) {
                throw new FormatValidationError(m.INVALID_FORMAT, error.errors, s.BAD_REQUEST);
            }
            throw new EntityError(m.ENTITY_INITAILIZE_ERROR, null);
        }
    }

    private validate(data: CustomerAttributes | null, customConfig?: Record<string, FieldConfigType>): void {
        if (data) this.validateData(data, customConfig);
        if (this.uuid) this.validateUUID(this.uuid);
    }

    private validateData(data: CustomerAttributes, customConfig?: Record<string, FieldConfigType>): void {
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

    public getAttributes(): CustomerAttributes {
        return this.attributes;
    }
}
