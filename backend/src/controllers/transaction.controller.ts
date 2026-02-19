import express, { NextFunction, Request, Response, Router } from "express";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s, ResponseMessageEnum as m } from "@/enum/response.enum";
import { TransactionModule } from "@/modules/transaction.module";
import { SalesTransactionCreateRequestType, SalesTransactionUpdateRequestType } from "@/types/transaction/request.type";

export class TransactionController {
    private readonly transactionModule: TransactionModule;
    public router: Router;

    constructor(transactionModule: TransactionModule) {
        this.transactionModule = transactionModule;
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get("/list", this.getList.bind(this));
        this.router.get("/:id", this.getOne.bind(this));
        this.router.get("/", this.getAll.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.post("/bulk", this.bulkCreate.bind(this));
        this.router.patch("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));
    }

    private async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.transactionModule.getOne(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.transactionModule.getAll();
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = Number(req.query.limit) || 10;
            const page = Number(req.query.page) || 1;

            const response = await this.transactionModule.getList(limit, page);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data: SalesTransactionCreateRequestType = req.body;
            const response = await this.transactionModule.create(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async bulkCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const data: SalesTransactionCreateRequestType[] = req.body;
            const response = await this.transactionModule.bulkCreate(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const data: SalesTransactionUpdateRequestType = req.body;
            const response = await this.transactionModule.update(id, data);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.transactionModule.delete(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }
}
