import { FieldConfigMap } from "@/types/validation/validate.type";
import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";
import { ProductCreateRequestType, ProductUpdateRequestType } from "@/types/product/request.type";
import { ProductCategoryEnum } from "@/enum/product.enum";

export const createConfig: FieldConfigMap<ProductCreateRequestType> = {
    product_code: {
        type: v.STRING,
        required: true,
        maxLength: 50,
    },
    product_name: {
        type: v.STRING,
        required: true,
        maxLength: 255,
    },
    category: {
        type: v.ENUM,
        required: true,
        enumValues: Object.values(ProductCategoryEnum),
    },
    cost_price: {
        type: v.DECIMAL,
        required: true,
    },
    selling_price: {
        type: v.DECIMAL,
        required: true,
    },
};

export const updateConfig: FieldConfigMap<ProductUpdateRequestType> = {
    product_code: {
        type: v.STRING,
        required: false,
        maxLength: 50,
    },
    product_name: {
        type: v.STRING,
        required: false,
        maxLength: 255,
    },
    category: {
        type: v.ENUM,
        required: false,
        enumValues: Object.values(ProductCategoryEnum),
    },
    cost_price: {
        type: v.DECIMAL,
        required: false,
    },
    selling_price: {
        type: v.DECIMAL,
        required: false,
    },
};
