import { FieldConfigMap } from "@/types/validation/validate.type";
import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";
import { CustomerTypeEnum } from "@/enum/customer.enum";
import { CustomerCreateRequestType, CustomerUpdateRequestType } from "@/types/customer/request.type";

export const createConfig: FieldConfigMap<CustomerCreateRequestType> = {
    customer_code: {
        type: v.STRING,
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    first_name: {
        type: v.STRING,
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    last_name: {
        type: v.STRING,
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    phone: {
        type: v.PHONE,
        required: true,
    },
    email: {
        type: v.EMAIL,
        required: true,
    },
    address: {
        type: v.STRING,
        required: true,
        maxLength: 255,
    },
    city: {
        type: v.STRING,
        required: true,
        maxLength: 100,
    },
    postal_code: {
        type: v.STRING,
        required: true,
        maxLength: 10,
    },
    customer_type: {
        type: v.ENUM,
        required: true,
        enumValues: Object.values(CustomerTypeEnum),
    },
};

export const updateConfig: FieldConfigMap<CustomerUpdateRequestType> = {
    customer_code: {
        type: v.STRING,
        required: false,
        minLength: 2,
        maxLength: 100,
    },
    first_name: {
        type: v.STRING,
        required: false,
        minLength: 2,
        maxLength: 100,
    },
    last_name: {
        type: v.STRING,
        required: false,
        minLength: 2,
        maxLength: 100,
    },
    phone: {
        type: v.PHONE,
        required: false,
    },
    email: {
        type: v.EMAIL,
        required: false,
    },
    address: {
        type: v.STRING,
        required: false,
        maxLength: 255,
    },
    city: {
        type: v.STRING,
        required: false,
        maxLength: 100,
    },
    postal_code: {
        type: v.STRING,
        required: false,
        maxLength: 10,
    },
};
