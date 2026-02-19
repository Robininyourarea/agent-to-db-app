import { FieldConfigType } from "@/types/validation/validate.type";
import { ProductCategoryEnum } from "@/enum/product.enum";
import { EntityError, FormatValidationError } from "@/middlewares/errorHandler";
import { v7 as uuidv7 } from "uuid";
import { validated } from "@/utils/validations";
import { createConfig } from "@/validations/product.validate";
import { uuidValidateConfig } from "@/validations/uuid.validate";
import { ResponseMessageEnum as m, ResponseStatusCodeEnum as s } from "@/enum/response.enum";

export interface ProductAttributes {
    uuid: string;
    product_code: string;
    product_name: string;
    category: ProductCategoryEnum;
    cost_price: number;
    selling_price: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class ProductEntity {
    private readonly uuid: string | null;
    private readonly attributes: ProductAttributes;
    constructor(
        uuid: string | null = null,
        data: ProductAttributes | null = null,
        customConfig?: Record<string, FieldConfigType>,
    ) {
        this.uuid = uuid;
        this.attributes = this.initialize(data, customConfig);
    }

    private initialize(
        data: ProductAttributes | null,
        customConfig?: Record<string, FieldConfigType>,
    ): ProductAttributes {
        try {
            this.validate(data, customConfig);
            return {
                uuid: this.uuid ?? uuidv7(),
                product_code: data?.product_code,
                product_name: data?.product_name,
                category: data?.category,
                cost_price: data?.cost_price,
                selling_price: data?.selling_price,
                is_active: data?.is_active ?? true,
                created_at: data?.created_at,
                updated_at: data?.updated_at,
                deleted_at: data?.deleted_at,
            } as ProductAttributes;
        } catch (error) {
            if (error instanceof FormatValidationError) {
                throw new FormatValidationError(m.INVALID_FORMAT, error.errors, s.BAD_REQUEST);
            }
            throw new EntityError(m.ENTITY_INITAILIZE_ERROR, null);
        }
    }

    private validate(data: ProductAttributes | null, customConfig?: Record<string, FieldConfigType>): void {
        if (data) this.validateData(data, customConfig);
        if (this.uuid) this.validateUUID(this.uuid);
    }

    private validateData(data: ProductAttributes, customConfig?: Record<string, FieldConfigType>): void {
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

    public getAttributes(): ProductAttributes {
        return this.attributes;
    }
}
