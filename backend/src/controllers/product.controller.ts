import express, { NextFunction, Request, Response, Router } from "express";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s, ResponseMessageEnum as m } from "@/enum/response.enum";
import { ProductModule } from "@/modules/product.module";
import { ProductCreateRequestType, ProductUpdateRequestType } from "@/types/product/request.type";

export class ProductController {
    private readonly productModule: ProductModule;
    public router: Router;

    constructor(productModule: ProductModule) {
        this.productModule = productModule;
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get("/search", this.getByName.bind(this));
        this.router.get("/list/page", this.getList.bind(this));
        this.router.get("/:id", this.getOne.bind(this));
        this.router.get("/", this.getAll.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.post("/bulk", this.bulkCreate.bind(this));
        this.router.put("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));
    }

    private async getByName(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.query.name as string;
            if (!name) {
                res.status(400).json({ message: "name query parameter is required" });
                return;
            }
            const response = await this.productModule.getByName(name);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.productModule.getOne(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.productModule.getAll();
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = Number(req.query.limit) || 10;
            const page = Number(req.query.page) || 1;
            const response = await this.productModule.getList(limit, page);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data: ProductCreateRequestType = req.body;
            const response = await this.productModule.create(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async bulkCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const data: ProductCreateRequestType[] = req.body;
            const response = await this.productModule.bulkCreate(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const data: ProductUpdateRequestType = req.body;
            const response = await this.productModule.update(id, data);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.productModule.delete(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }
}
