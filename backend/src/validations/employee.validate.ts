import { FieldConfigMap } from "@/types/validation/validate.type";
import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";
import { EmployeeCreateRequestType, EmployeeUpdateRequestType } from "@/types/employee/request.type";
import { EmployeePositionEnum } from "@/enum/employee.enum";

export const createConfig: FieldConfigMap<EmployeeCreateRequestType> = {
    employee_code: {
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
    position: {
        type: v.ENUM,
        required: true,
        enumValues: Object.values(EmployeePositionEnum),
    },
    phone: {
        type: v.PHONE,
        required: true,
    },
    email: {
        type: v.EMAIL,
        required: true,
    },
    hire_date: {
        type: v.DATE_ONLY,
        required: true,
    },
};

export const updateConfig: FieldConfigMap<EmployeeUpdateRequestType> = {
    employee_code: {
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
    position: {
        type: v.ENUM,
        required: false,
        enumValues: Object.values(EmployeePositionEnum),
    },
    phone: {
        type: v.PHONE,
        required: false,
    },
    email: {
        type: v.EMAIL,
        required: false,
    },
    hire_date: {
        type: v.DATE,
        required: false,
    },
};
