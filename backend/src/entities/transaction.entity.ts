import { FieldConfigType } from "@/types/validation/validate.type";
import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";
import { EntityError, FormatValidationError } from "@/middlewares/errorHandler";
import { v7 as uuidv7 } from "uuid";
import { validated } from "@/utils/validations";
import { createConfig } from "@/validations/transaction.validate";
import { uuidValidateConfig } from "@/validations/uuid.validate";
import { ResponseMessageEnum as m, ResponseStatusCodeEnum as s } from "@/enum/response.enum";

export interface SalesTransactionAttributes {
    uuid: string;
    sale_date: Date;
    customer_uuid: string;
    employee_uuid: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: PaymentMethodEnum;
    payment_status: PaymentStatusEnum;
    due_date: Date;
    status: TransactionStatusEnum;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class TransactionEntity {
    private readonly uuid: string | null;
    private readonly attributes: SalesTransactionAttributes;
    constructor(
        uuid: string | null = null,
        data: SalesTransactionAttributes | null = null,
        customConfig?: Record<string, FieldConfigType>,
    ) {
        this.uuid = uuid;
        this.attributes = this.initialize(data, customConfig);
    }

    private initialize(
        data: SalesTransactionAttributes | null,
        customConfig?: Record<string, FieldConfigType>,
    ): SalesTransactionAttributes {
        try {
            this.validate(data, customConfig);
            return {
                uuid: this.uuid ?? uuidv7(),
                sale_date: data?.sale_date,
                customer_uuid: data?.customer_uuid,
                employee_uuid: data?.employee_uuid,
                subtotal: data?.subtotal,
                tax_amount: data?.tax_amount ?? 0,
                discount_amount: data?.discount_amount ?? 0,
                total_amount: data?.total_amount,
                payment_method: data?.payment_method,
                payment_status: data?.payment_status ?? PaymentStatusEnum.PAID,
                due_date: data?.due_date,
                status: data?.status ?? TransactionStatusEnum.COMPLETED,
                created_at: data?.created_at,
                updated_at: data?.updated_at,
                deleted_at: data?.deleted_at,
            } as SalesTransactionAttributes;
        } catch (error) {
            if (error instanceof FormatValidationError) {
                throw new FormatValidationError(m.INVALID_FORMAT, error.errors, s.BAD_REQUEST);
            }
            throw new EntityError(m.ENTITY_INITAILIZE_ERROR, null);
        }
    }

    private validate(data: SalesTransactionAttributes | null, customConfig?: Record<string, FieldConfigType>): void {
        if (data) this.validateData(data, customConfig);
        if (this.uuid) this.validateUUID(this.uuid);
    }

    private validateData(data: SalesTransactionAttributes, customConfig?: Record<string, FieldConfigType>): void {
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

    public getAttributes(): SalesTransactionAttributes {
        return this.attributes;
    }
}
