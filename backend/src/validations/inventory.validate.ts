import { FieldConfigMap } from "@/types/validation/validate.type";
import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";
import { InventoryCreateRequestType, InventoryUpdateRequestType } from "@/types/inventory/request.type";

export const createConfig: FieldConfigMap<InventoryCreateRequestType> = {
    product_uuid: {
        type: v.UUID,
        required: true,
    },
    warehouse_name: {
        type: v.STRING,
        required: true,
        maxLength: 100,
    },
    quantity: {
        type: v.NUMBER,
        required: true,
        min: 0,
    },
};

export const updateConfig: FieldConfigMap<InventoryUpdateRequestType> = {
    product_uuid: {
        type: v.UUID,
        required: false,
    },
    warehouse_name: {
        type: v.STRING,
        required: false,
        maxLength: 100,
    },
    quantity: {
        type: v.NUMBER,
        required: false,
        min: 0,
    },
};
