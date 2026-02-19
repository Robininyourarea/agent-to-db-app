import { CustomerTypeEnum } from "@/enum/customer.enum";

export type CustomerCreateRequestType = {
    customer_code: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
    customer_type: CustomerTypeEnum;
};

export type CustomerUpdateRequestType = {
    customer_code?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    customer_type?: CustomerTypeEnum;
};
