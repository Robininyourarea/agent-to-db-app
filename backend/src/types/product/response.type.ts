import { ProductCategoryEnum } from "@/enum/product.enum";

export type ProductResponse = {
    uuid: string;
    product_code: string;
    product_name: string;
    category: ProductCategoryEnum;
    cost_price: number;
    selling_price: number;
    is_active: boolean;
};

export type ProductListResponse = {
    rows: ProductResponse[];
    count: number;
};
