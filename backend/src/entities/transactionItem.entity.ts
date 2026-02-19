import { FieldConfigType } from "@/types/validation/validate.type";
import { EntityError, FormatValidationError } from "@/middlewares/errorHandler";
import { v7 as uuidv7 } from "uuid";
import { validated } from "@/utils/validations";
import { createItemConfig } from "@/validations/transaction.validate";
import { uuidValidateConfig } from "@/validations/uuid.validate";
import { ResponseMessageEnum as m, ResponseStatusCodeEnum as s } from "@/enum/response.enum";

export interface SalesTransactionItemAttributes {
    uuid: string;
    sale_uuid: string;
    product_uuid: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    subtotal: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class TransactionItemEntity {
    private readonly uuid: string | null;
    private readonly attributes: SalesTransactionItemAttributes;
    constructor(
        uuid: string | null = null,
        data: SalesTransactionItemAttributes | null = null,
        customConfig?: Record<string, FieldConfigType>,
    ) {
        this.uuid = uuid;
        this.attributes = this.initialize(data, customConfig);
    }

    private initialize(
        data: SalesTransactionItemAttributes | null,
        customConfig?: Record<string, FieldConfigType>,
    ): SalesTransactionItemAttributes {
        try {
            this.validate(data, customConfig);
            return {
                uuid: this.uuid ?? uuidv7(),
                sale_uuid: data?.sale_uuid,
                product_uuid: data?.product_uuid,
                quantity: data?.quantity,
                unit_price: data?.unit_price,
                discount_amount: data?.discount_amount ?? 0,
                subtotal: data?.subtotal,
                created_at: data?.created_at,
                updated_at: data?.updated_at,
                deleted_at: data?.deleted_at,
            } as SalesTransactionItemAttributes;
        } catch (error) {
            if (error instanceof FormatValidationError) {
                throw new FormatValidationError(m.INVALID_FORMAT, error.errors, s.BAD_REQUEST);
            }
            throw new EntityError(m.ENTITY_INITAILIZE_ERROR, null);
        }
    }

    private validate(
        data: SalesTransactionItemAttributes | null,
        customConfig?: Record<string, FieldConfigType>,
    ): void {
        if (data) this.validateData(data, customConfig);
        if (this.uuid) this.validateUUID(this.uuid);
    }

    private validateData(data: SalesTransactionItemAttributes, customConfig?: Record<string, FieldConfigType>): void {
        const schema = customConfig ?? createItemConfig;
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

    public getAttributes(): SalesTransactionItemAttributes {
        return this.attributes;
    }
}
