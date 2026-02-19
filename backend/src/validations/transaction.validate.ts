import { FieldConfigMap } from "@/types/validation/validate.type";
import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";
import {
    SalesTransactionCreateRequestType,
    SalesTransactionUpdateRequestType,
    SalesTransactionItemCreateRequestType,
    SalesTransactionItemUpdateRequestType,
} from "@/types/transaction/request.type";
import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";

export const createConfig: FieldConfigMap<SalesTransactionCreateRequestType> = {
    sale_date: {
        type: v.DATE,
        required: true,
    },
    customer_uuid: {
        type: v.UUID,
        required: false,
    },
    employee_uuid: {
        type: v.UUID,
        required: true,
    },
    subtotal: {
        type: v.DECIMAL,
        required: true,
    },
    tax_amount: {
        type: v.DECIMAL,
        required: true,
    },
    discount_amount: {
        type: v.DECIMAL,
        required: true,
    },
    total_amount: {
        type: v.DECIMAL,
        required: true,
    },
    payment_method: {
        type: v.ENUM,
        required: true,
        enumValues: Object.values(PaymentMethodEnum),
    },
    payment_status: {
        type: v.ENUM,
        required: true,
        enumValues: Object.values(PaymentStatusEnum),
    },
    due_date: {
        type: v.DATE_ONLY,
        required: true,
    },
    status: {
        type: v.ENUM,
        required: true,
        enumValues: Object.values(TransactionStatusEnum),
    },
};

export const updateConfig: FieldConfigMap<SalesTransactionUpdateRequestType> = {
    sale_date: {
        type: v.DATE,
        required: false,
    },
    customer_uuid: {
        type: v.UUID,
        required: false,
    },
    employee_uuid: {
        type: v.UUID,
        required: false,
    },
    subtotal: {
        type: v.DECIMAL,
        required: false,
    },
    tax_amount: {
        type: v.DECIMAL,
        required: false,
    },
    discount_amount: {
        type: v.DECIMAL,
        required: false,
    },
    total_amount: {
        type: v.DECIMAL,
        required: false,
    },
    payment_method: {
        type: v.ENUM,
        required: false,
        enumValues: Object.values(PaymentMethodEnum),
    },
    payment_status: {
        type: v.ENUM,
        required: false,
        enumValues: Object.values(PaymentStatusEnum),
    },
    due_date: {
        type: v.DATE_ONLY,
        required: false,
    },
    status: {
        type: v.ENUM,
        required: false,
        enumValues: Object.values(TransactionStatusEnum),
    },
};

export const createItemConfig: FieldConfigMap<SalesTransactionItemCreateRequestType> = {
    sale_uuid: {
        type: v.UUID,
        required: true,
    },
    product_uuid: {
        type: v.UUID,
        required: true,
    },
    quantity: {
        type: v.NUMBER,
        required: true,
        min: 1,
    },
    unit_price: {
        type: v.DECIMAL,
        required: true,
    },
    discount_amount: {
        type: v.DECIMAL,
        required: true,
    },
    subtotal: {
        type: v.DECIMAL,
        required: true,
    },
};

export const updateItemConfig: FieldConfigMap<SalesTransactionItemUpdateRequestType> = {
    sale_uuid: {
        type: v.UUID,
        required: false,
    },
    product_uuid: {
        type: v.UUID,
        required: false,
    },
    quantity: {
        type: v.NUMBER,
        required: false,
        min: 1,
    },
    unit_price: {
        type: v.DECIMAL,
        required: false,
    },
    discount_amount: {
        type: v.DECIMAL,
        required: false,
    },
    subtotal: {
        type: v.DECIMAL,
        required: false,
    },
};
