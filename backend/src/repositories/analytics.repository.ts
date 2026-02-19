import { Op, Sequelize } from "sequelize";
import {
    SalesTransactionModel,
    SalesTransactionItemModel,
    ProductModel,
    InventoryModel,
    CustomerModel,
} from "@/models/allModels";
import { TransactionStatusEnum, PaymentStatusEnum } from "@/enum/transaction.enum";
import { RepositoryError } from "@/middlewares/errorHandler";
import { DatabaseErrorEnum as d } from "@/enum/errors.enum";
import { ResponseMessageEnum as m } from "@/enum/response.enum";

export class AnalyticsRepository {
    async getSalesSummary(
        startDate: Date,
        adjustedEndDate: Date,
    ): Promise<{ total_revenue: number; transaction_count: number }> {
        try {
            const where = {
                sale_date: {
                    [Op.between]: [startDate, adjustedEndDate],
                },
                status: TransactionStatusEnum.COMPLETED,
                payment_status: PaymentStatusEnum.PAID,
            };

            const totalRevenue = (await SalesTransactionModel.sum("total_amount", { where })) || 0;
            const transactionCount = await SalesTransactionModel.count({ where });

            return { total_revenue: totalRevenue, transaction_count: transactionCount };
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getTopSellingProducts(limit: number, startDate: Date, adjustedEndDate: Date): Promise<any[]> {
        try {
            const topProducts = await SalesTransactionItemModel.findAll({
                attributes: [
                    "product_uuid",
                    [Sequelize.fn("SUM", Sequelize.col("SalesTransactionItem.quantity")), "total_quantity"],
                    [Sequelize.fn("SUM", Sequelize.col("SalesTransactionItem.subtotal")), "total_revenue"],
                ],
                include: [
                    {
                        model: SalesTransactionModel,
                        as: "transaction",
                        attributes: [],
                        where: {
                            sale_date: {
                                [Op.between]: [startDate, adjustedEndDate],
                            },
                            status: TransactionStatusEnum.COMPLETED,
                            payment_status: PaymentStatusEnum.PAID,
                        },
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["product_name", "product_code", "category"],
                    },
                ],
                group: [
                    "product_uuid",
                    "product.uuid",
                    "product.product_name",
                    "product.product_code",
                    "product.category",
                ],
                order: [[Sequelize.literal("total_quantity"), "DESC"]],
                limit,
            });

            return topProducts;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getLowStockInventory(threshold: number): Promise<any[]> {
        try {
            const items = await InventoryModel.findAll({
                where: {
                    quantity: { [Op.lte]: threshold },
                    is_active: true,
                },
                include: [
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["product_name", "product_code", "category"],
                    },
                ],
                order: [["quantity", "ASC"]],
            });
            return items;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }

    async getPendingPayments(): Promise<any[]> {
        try {
            const transactions = await SalesTransactionModel.findAll({
                where: {
                    payment_status: PaymentStatusEnum.PENDING,
                },
                include: [
                    {
                        model: CustomerModel,
                        as: "customer",
                        attributes: ["customer_code", "first_name", "last_name"],
                    },
                ],
                order: [["due_date", "ASC"]],
            });
            return transactions;
        } catch (error) {
            throw new RepositoryError(d.DATABASE_TIMEOUT, m.DATABASE_ERROR);
        }
    }
}
