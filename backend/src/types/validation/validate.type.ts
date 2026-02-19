import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";

export interface FieldConfigType {
    type: v;
    enumValues?: string[];
    message?: string;
    required?: boolean;
    allowNull?: boolean;
    array?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    minElement?: number;
    maxElement?: number;
    precision?: number;
    scale?: number;
    objectConfig?: Record<string, FieldConfigType>;
}

export type FieldConfigMap<T> = {
    [K in keyof T]: FieldConfigType;
};

export interface ValidationErrorType {
    isValid: boolean;
    message: string;
    code: string;
    error: {
        field: string;
        message: string;
        enumValues?: string[];
    };
}
