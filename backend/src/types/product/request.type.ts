import { ProductCategoryEnum } from "@/enum/product.enum";

export type ProductCreateRequestType = {
    product_code: string;
    product_name: string;
    category: ProductCategoryEnum;
    cost_price: number;
    selling_price: number;
    is_active?: boolean;
};

export type ProductUpdateRequestType = {
    product_code?: string;
    product_name?: string;
    category?: ProductCategoryEnum;
    cost_price?: number;
    selling_price?: number;
    is_active?: boolean;
};
