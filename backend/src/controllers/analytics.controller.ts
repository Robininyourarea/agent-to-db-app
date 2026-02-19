import express, { NextFunction, Request, Response, Router } from "express";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s, ResponseMessageEnum as m } from "@/enum/response.enum";
import { AnalyticsModule } from "@/modules/analytics.module";
import { SalesSummaryRequestType, TopSellingProductsRequestType, LowStockInventoryRequestType } from "@/types/analytics/request.type";

export class AnalyticsController {
    private readonly analyticsModule: AnalyticsModule;
    public router: Router;

    constructor(analyticsModule: AnalyticsModule) {
        this.analyticsModule = analyticsModule;
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get("/sales-summary", this.getSalesSummary.bind(this));
        this.router.get("/top-products", this.getTopSellingProducts.bind(this));
        this.router.get("/low-stock", this.getLowStockInventory.bind(this));
        this.router.get("/pending-payments", this.getPendingPayments.bind(this));
    }

    private async getSalesSummary(req: Request<{}, {}, {}, SalesSummaryRequestType>, res: Response, next: NextFunction) {
        try {
            const { start_date: startDateStr, end_date: endDateStr } = req.query;

            if (!startDateStr || !endDateStr) {
                res.status(400).json({ message: "start_date and end_date are required" });
                return;
            }

            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            const response = await this.analyticsModule.getSalesSummary(startDate, endDate);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getTopSellingProducts(req: Request<{}, {}, {}, TopSellingProductsRequestType>, res: Response, next: NextFunction) {
        try {
            const { start_date: startDateStr, end_date: endDateStr, limit: limitStr } = req.query;
            const limit = Number(limitStr) || 5;

            if (!startDateStr || !endDateStr) {
                res.status(400).json({ message: "start_date and end_date are required" });
                return;
            }

            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            const response = await this.analyticsModule.getTopSellingProducts(limit, startDate, endDate);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getLowStockInventory(req: Request<{}, {}, {}, LowStockInventoryRequestType>, res: Response, next: NextFunction) {
        try {
            const threshold = Number(req.query.threshold) || 10;
            const response = await this.analyticsModule.getLowStockInventory(threshold);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getPendingPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.analyticsModule.getPendingPayments();
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }
}
