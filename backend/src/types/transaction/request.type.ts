import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";

export type SalesTransactionCreateRequestType = {
    sale_date: Date;
    customer_uuid?: string;
    employee_uuid: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: PaymentMethodEnum;
    payment_status: PaymentStatusEnum;
    due_date: Date;
    status: TransactionStatusEnum;
};

export type SalesTransactionUpdateRequestType = {
    sale_date?: Date;
    customer_uuid?: string;
    employee_uuid?: string;
    subtotal?: number;
    tax_amount?: number;
    discount_amount?: number;
    total_amount?: number;
    payment_method?: PaymentMethodEnum;
    payment_status?: PaymentStatusEnum;
    due_date?: Date;
    status?: TransactionStatusEnum;
};

export type SalesTransactionItemCreateRequestType = {
    sale_uuid: string;
    product_uuid: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    subtotal: number;
};

export type SalesTransactionItemUpdateRequestType = {
    sale_uuid?: string;
    product_uuid?: string;
    quantity?: number;
    unit_price?: number;
    discount_amount?: number;
    subtotal?: number;
};
