import express, { NextFunction, Request, Response, Router } from "express";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s, ResponseMessageEnum as m } from "@/enum/response.enum";
import { CustomerModule } from "@/modules/customer.module";
import { CustomerCreateRequestType, CustomerUpdateRequestType } from "@/types/customer/request.type";

export class CustomerController {
    private readonly customerModule: CustomerModule;
    public router: Router;

    constructor(customerModule: CustomerModule) {
        this.customerModule = customerModule;
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get("/list", this.getList.bind(this)); // Specific route first
        this.router.get("/search", this.getByName.bind(this));
        this.router.get("/:id", this.getOne.bind(this));
        this.router.get("/", this.getAll.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.post("/bulk", this.bulkCreate.bind(this));
        this.router.patch("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));
    }

    private async getByName(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.query.name as string;
            if (!name) {
                res.status(400).json({ message: "name query parameter is required" });
                return;
            }
            const response = await this.customerModule.getByName(name);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.customerModule.getOne(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.customerModule.getAll();
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = Number(req.query.limit) || 10;
            const page = Number(req.query.page) || 1;

            const response = await this.customerModule.getList(limit, page);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data: CustomerCreateRequestType = req.body;
            const response = await this.customerModule.create(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async bulkCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const data: CustomerCreateRequestType[] = req.body; // Expecting array of customers
            const response = await this.customerModule.bulkCreate(data);
            res.responseJson(s.CREATED, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const data: CustomerUpdateRequestType = req.body;
            const response = await this.customerModule.update(id, data);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }

    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await this.customerModule.delete(id);
            res.responseJson(s.SUCCESS, r.SUCCESS, m.SUCCESS, response, null);
        } catch (error) {
            next(error);
        }
    }
}
