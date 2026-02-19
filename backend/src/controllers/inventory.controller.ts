import express, { NextFunction, Request, Response, Router } from "express";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s, ResponseMessageEnum as m } from "@/enum/response.enum";
import { InventoryModule } from "@/modules/inventory.module";
import { InventoryCreateRequestType, InventoryUpdateRequestType } from "@/types/inventory/request.type";

export class InventoryController {
    private readonly inventoryModule: InventoryModule;
    public router: Router;

    constructor(inventoryModule: InventoryModule) {
        this.inventoryModule = inventoryModule;
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get("/:id", this.getOne.bind(this));
        this.router.get("/", this.getAll.bind(this));
        this.router.get("/list/page", this.getList.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.post("/bulk", this.bulkCreate.bind(this));
        this.router.put("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));
    }

    private async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.inventoryModule.getOne(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.inventoryModule.getAll();
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = Number(req.query.limit) || 10;
            const page = Number(req.query.page) || 1;
            const response = await this.inventoryModule.getList(limit, page);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data: InventoryCreateRequestType = req.body;
            const response = await this.inventoryModule.create(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async bulkCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const data: InventoryCreateRequestType[] = req.body;
            const response = await this.inventoryModule.bulkCreate(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const data: InventoryUpdateRequestType = req.body;
            const response = await this.inventoryModule.update(id, data);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.inventoryModule.delete(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }
}
