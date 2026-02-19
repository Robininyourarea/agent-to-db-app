import { EmployeePositionEnum } from "@/enum/employee.enum";

export type EmployeeCreateRequestType = {
    employee_code: string;
    first_name: string;
    last_name: string;
    position: EmployeePositionEnum;
    phone: string;
    email: string;
    hire_date: Date;
};

export type EmployeeUpdateRequestType = {
    employee_code?: string;
    first_name?: string;
    last_name?: string;
    position?: EmployeePositionEnum;
    phone?: string;
    email?: string;
    hire_date?: Date;
};
