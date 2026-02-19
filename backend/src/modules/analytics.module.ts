import { AnalyticsRepository } from "@/repositories/analytics.repository";
import { RepositoryError, DefaultError } from "@/middlewares/errorHandler";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";
import { SalesSummaryResponse, TopSellingProductResponse, LowStockInventoryResponse, PendingPaymentResponse } from "@/types/analytics/response.type";

export class AnalyticsModule {
    private readonly analyticsRepository: AnalyticsRepository;

    constructor() {
        this.analyticsRepository = new AnalyticsRepository();
    }

    public async getSalesSummary(startDate: Date, endDate: Date): Promise<SalesSummaryResponse> {
        try {
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);

            const result = await this.analyticsRepository.getSalesSummary(startDate, adjustedEndDate);

            return {
                ...result,
                period: {
                    start: startDate,
                    end: adjustedEndDate,
                },
            };
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_SALES_SUMMARY_FAILED);
        }
    }

    public async getTopSellingProducts(limit: number, startDate: Date, endDate: Date): Promise<TopSellingProductResponse[]> {
        try {
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);

            const topProducts = await this.analyticsRepository.getTopSellingProducts(limit, startDate, adjustedEndDate);

            return topProducts.map((item: any) => ({
                product_uuid: item.product_uuid,
                product_name: item.product?.product_name,
                product_code: item.product?.product_code,
                category: item.product?.category,
                total_quantity: Number(item.getDataValue("total_quantity")),
                total_revenue: Number(item.getDataValue("total_revenue")),
            }));
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_TOP_PRODUCTS_FAILED);
        }
    }

    public async getLowStockInventory(threshold: number): Promise<LowStockInventoryResponse[]> {
        try {
            const items = await this.analyticsRepository.getLowStockInventory(threshold);
            return items.map((item: any) => ({
                inventory_uuid: item.uuid,
                warehouse_name: item.warehouse_name,
                quantity: item.quantity,
                product_uuid: item.product_uuid,
                product_name: item.product?.product_name,
                product_code: item.product?.product_code,
                category: item.product?.category,
            }));
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_LOW_STOCK_INVENTORY_FAILED);
        }
    }

    public async getPendingPayments(): Promise<PendingPaymentResponse[]> {
        try {
            const transactions = await this.analyticsRepository.getPendingPayments();
            return transactions.map((t: any) => ({
                transaction_uuid: t.uuid,
                sale_date: t.sale_date,
                due_date: t.due_date,
                total_amount: Number(t.total_amount),
                payment_method: t.payment_method,
                payment_status: t.payment_status,
                status: t.status,
                customer_uuid: t.customer_uuid,
                customer_code: t.customer?.customer_code,
                customer_name: `${t.customer?.first_name} ${t.customer?.last_name}`.trim(),
            }));
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw new DefaultError(e.REPOSITORY_ERROR, error.message, null, error.errors, error.statusCode);
            }
            throw new DefaultError(e.INTERNAL_SERVER_ERROR, m.GET_PENDING_PAYMENTS_FAILED);
        }
    }
}
