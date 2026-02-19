import { EmployeePositionEnum } from "@/enum/employee.enum";

export type EmployeeResponse = {
    uuid: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    position: EmployeePositionEnum;
    phone: string;
    email: string;
    hire_date: Date;
    is_active: boolean;
};

export type EmployeeListResponse = {
    rows: EmployeeResponse[];
    count: number;
};
