import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";

export type TransactionCustomerResponse = {
    uuid: string;
    customer_code: string;
    first_name: string;
    last_name: string;
};

export type TransactionEmployeeResponse = {
    uuid: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    position: string;
};

export type TransactionItemResponse = {
    uuid: string;
    sale_uuid: string;
    product_uuid: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    subtotal: number;
};

export type SalesTransactionResponse = {
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
    customer?: TransactionCustomerResponse;
    employee?: TransactionEmployeeResponse;
    items?: TransactionItemResponse[];
};
