export type SalesSummaryRequestType = {
    start_date: string;
    end_date: string;
};

export type TopSellingProductsRequestType = {
    start_date: string;
    end_date: string;
    limit?: number;
};

export type LowStockInventoryRequestType = {
    threshold?: number;
};

export type PendingPaymentsRequestType = Record<string, never>;
