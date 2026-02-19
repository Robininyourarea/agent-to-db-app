import { CustomerTypeEnum } from "@/enum/customer.enum";

export type CustomerResponse = {
    uuid: string;
    customer_code: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
    customer_type: CustomerTypeEnum;
    is_active: boolean;
};

export type CustomerListResponse = {
    rows: CustomerResponse[];
    count: number;
};
