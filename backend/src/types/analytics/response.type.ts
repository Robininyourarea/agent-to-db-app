import { ProductCategoryEnum } from "@/enum/product.enum";
import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";

export type SalesSummaryResponse = {
    total_revenue: number;
    transaction_count: number;
    period: {
        start: Date;
        end: Date;
    };
};

export type TopSellingProductResponse = {
    product_uuid: string;
    product_name: string;
    product_code: string;
    category: ProductCategoryEnum;
    total_quantity: number;
    total_revenue: number;
};

export type LowStockInventoryResponse = {
    inventory_uuid: string;
    warehouse_name: string;
    quantity: number;
    product_uuid: string;
    product_name: string;
    product_code: string;
    category: ProductCategoryEnum;
};

export type PendingPaymentResponse = {
    transaction_uuid: string;
    sale_date: Date;
    due_date: Date;
    total_amount: number;
    payment_method: PaymentMethodEnum;
    payment_status: PaymentStatusEnum;
    status: TransactionStatusEnum;
    customer_uuid: string;
    customer_code: string;
    customer_name: string;
};
