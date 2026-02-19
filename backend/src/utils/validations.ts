import { z, ZodTypeAny, ZodError, ZodString, ZodNumber, ZodBoolean, ZodObject, ZodIssue, ZodArray } from "zod";
import { ResponseValidationTypeEnum as v, ResponseValidationMessageEnum as m } from "@/enum/validate.enum";
import { FieldConfigType } from "@/types/validation/validate.type";

class Validator {
    private readonly fieldName: string;
    private readonly config: FieldConfigType;

    constructor(fieldName: string, config: FieldConfigType) {
        this.fieldName = fieldName;
        this.config = config;
    }

    public getValidator(): ZodTypeAny {
        const { type, enumValues = [] } = this.config;

        // Object lookup instead of switch case
        const validatorMap: Record<string, () => ZodTypeAny> = {
            [v.UUID]: () => this.validateUUID(),
            [v.STRING]: () => this.validateString(),
            [v.EMAIL]: () => this.validateEmail(),
            [v.PHONE]: () => this.validatePhone(),
            [v.LETTER_ONLY]: () => this.validateLettersOnly(),
            [v.NUMBER]: () => this.validateNumber(),
            [v.BOOLEAN]: () => this.validateBoolean(),
            [v.NO_SPECIAL_CHARACTERS]: () => this.validateNoSpecialChars(),
            [v.KEYCLOAK_PROHIBITED_CHARACTERS]: () => this.validateNoProhibitedCharsKeycloak(),
            [v.NO_PROHIBITED_CHARACTERS]: () => this.validateNoProhibitedChars(),
            [v.ENUM]: () => this.validateEnum(enumValues),
            [v.REQUIRED]: () => this.validateRequiredField(),
            [v.STRING_BOOLEAN_NUMERIC]: () => this.validateStringBooleanNumeric(),
            [v.STRING_DATE_FORMAT]: () => this.validateStringDateFormat(),
            [v.STRING_OF_NUMBER_OR_FLOAT]: () => this.validateStringOfNumberOrFloat(),
            [v.STRING_OF_MAP_COORDINATE]: () => this.validateStringOfMapCoordinate(),
            [v.STRING_DATE_RANGE]: () => this.validateStringDateRange(),
            [v.DATE]: () => this.validateDate(),
            [v.DATE_ONLY]: () => this.validateDateOnly(),
            [v.MONTH_WITH_YEAR]: () => this.validateMonthWithYear(),
            [v.YEAR_ONLY]: () => this.validateYearOnly(),
            [v.DATE_ISO]: () => this.validateDateISO(),
            [v.BIGINT]: () => this.validateBigInt(),
            [v.DECIMAL]: () => this.validateDecimal(),
            [v.DOUBLE]: () => this.validateDouble(),
            [v.OBJECT]: () => this.validateObject(),
            [v.ARRAY_STRING]: () => this.validateArrayString(),
            [v.BRANCH_CODE_FORMAT]: () => this.branchCodeFormat(),
        };
        // Return the validator or default if not found
        const validatorFn = validatorMap[type];
        const baseSchema = validatorFn ? validatorFn() : z.string().min(1, "none type");
        return this.wrapOptionality(baseSchema);
    }
    private wrapOptionality(baseSchema: ZodTypeAny): ZodTypeAny {
        const {
            allowNull = false,
            required = false,
            array = false,
            min,
            max,
            minLength,
            maxLength,
            minElement,
            maxElement,
        } = this.config;

        if (baseSchema instanceof ZodString) {
            let zodConfig: ZodString = baseSchema;
            if (typeof minLength === "number") zodConfig = zodConfig.min(minLength, `${m.MIN_CHAR} (${minLength})`);
            if (typeof maxLength === "number") zodConfig = zodConfig.max(maxLength, `${m.MAX_CHAR} (${maxLength})`);
            baseSchema = zodConfig;
        }
        if (baseSchema instanceof ZodNumber) {
            let zodConfig: ZodNumber = baseSchema;
            if (typeof min === "number") zodConfig = zodConfig.min(min, `${m.MIN_NUMBER} (${min})`);
            if (typeof max === "number") zodConfig = zodConfig.max(max, `${m.MAX_NUMBER} (${max})`);
            baseSchema = zodConfig;
        }
        if (array && !baseSchema._def.typeName.endsWith("Array")) {
            baseSchema = this.validateArray(baseSchema);
        }
        if (baseSchema instanceof ZodArray) {
            let zodConfig: ZodArray<ZodTypeAny> = baseSchema;
            if (typeof minElement === "number") zodConfig = zodConfig.min(minElement, m.MIN_ARRAY_ELEMENT);
            if (typeof maxElement === "number") zodConfig = zodConfig.max(maxElement, m.MAX_ARRAY_ELEMENT);
            baseSchema = zodConfig;
        }
        if (!required) baseSchema = baseSchema.optional();
        if (allowNull) baseSchema = baseSchema.nullable();

        return baseSchema;
    }
    private validateUUID(): ZodString {
        // UUID validation
        // This regex checks for both v1 to v7 UUIDs
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(uuidRegex, m.UUID);
        return base;
    }

    //String
    private validateString(): ZodString {
        let base = z.string({ required_error: m.IS_REQUIRED });
        return base;
    }

    //Email
    private validateEmail(): ZodString {
        let base = z.string({ required_error: m.IS_REQUIRED }).email(m.EMAIL);
        return base;
    }

    //Phone
    private validatePhone(): ZodString {
        const phoneRegex = /^(08|09|06)\d{8}$|^(02|03|04|05|07)\d{7}$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(phoneRegex, m.PHONE);
        return base;
    }

    //Enum
    private validateEnum(enumValues: string[]): z.ZodEffects<ZodString, string, string> {
        let base = z.string({ required_error: m.IS_REQUIRED }).refine((val) => enumValues.includes(val), {
            message: m.ENUM,
        });
        return base;
    }

    //Letters
    private validateLettersOnly(): ZodString {
        const pattern = /^[a-zA-Z\u0E00-\u0E7F\s]*$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.LETTER_ONLY);
        return base;
    }

    //Number
    private validateNumber(): ZodNumber {
        let base = z.number({ invalid_type_error: m.NUMBER });
        return base;
    }

    //Boolean
    private validateBoolean(): ZodBoolean {
        let base = z.boolean({ required_error: m.IS_REQUIRED });
        return base;
    }
    // Array
    private validateArray(value: ZodTypeAny): ZodArray<ZodTypeAny> {
        let base = z.array(value, { invalid_type_error: m.ARRAY, required_error: m.REQUIRED });
        return base;
    }

    //No Special
    private validateNoSpecialChars(): ZodString {
        const pattern = /^[a-zA-Z0-9\u0E00-\u0E7F\s]*$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.NO_SPECIAL_CHARACTERS);
        return base;
    }

    //Required
    private validateRequiredField(): ZodString {
        let base = z.string({ required_error: m.IS_REQUIRED });
        return base;
    }

    //No Prohibited characters
    private validateNoProhibitedCharsKeycloak(): ZodString {
        const pattern = /^[a-zA-Z0-9\u0E00-\u0E7F._-]*$/; // This regex allows letters, numbers, Thai characters, and the characters . _ -
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.NO_PROHIBITED_CHARACTERS);
        return base;
    }
    private validateNoProhibitedChars(): ZodString {
        const pattern = /^[a-zA-Z0-9\u0E00-\u0E7F,.' _-]*$/; // This regex allows letters, numbers, Thai characters, and the characters , . ' _ space -
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.NO_PROHIBITED_CHARACTERS);
        return base;
    }

    //String Boolean Numeric
    private validateStringBooleanNumeric(): ZodString {
        const pattern = /^[01]$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.STRING_BOOLEAN_NUMERIC);
        return base;
    }
    //String Date Format
    private validateStringDateFormat(): ZodString {
        const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.STRING_DATE_FORMAT);
        return base;
    }
    //String of Number
    private validateStringOfNumberOrFloat(): ZodString {
        const pattern = /^\d+(\.\d+)?$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.STRING_OF_NUMBER_OR_FLOAT);
        return base;
    }
    //String of Map Coordinate can be signed float
    private validateStringOfMapCoordinate(): ZodString {
        const pattern = /^-?\d+(\.\d+)?$/;
        let base = z.string({ required_error: m.IS_REQUIRED }).regex(pattern, m.STRING_OF_MAP_COORDINATE);
        return base;
    }
    //Date
    private validateDate(): z.ZodEffects<z.ZodUnion<[z.ZodDate, z.ZodString]>, Date, Date | string> {
        return z.union([z.date({ required_error: m.IS_REQUIRED }), this.validateString()]).transform((val) => {
            if (val instanceof Date) {
                return val;
            }
            // If it's a string, try to parse it as a Date
            const date = new Date(val);
            if (Number.isNaN(date.getTime())) {
                throw new Error(m.DATE || "Invalid date format");
            }
            return date;
        });
    }

    // Date Only
    private validateDateOnly(): z.ZodEffects<ZodString, Date, string> {
        const dateOnlyPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        return z
            .string({ required_error: m.IS_REQUIRED })
            .regex(dateOnlyPattern, m.DATE_ONLY)
            .transform((val) => {
                const date = new Date(val);
                if (Number.isNaN(date.getTime())) {
                    throw new Error(m.DATE);
                }
                return date;
            });
    }

    /**
     * Validate month with year format (YYYY-MM)
     * @returns Zod string validator with regex pattern for YYYY-MM
     * @example "2025-01", "2023-12"
     */
    private validateMonthWithYear(): ZodString {
        const monthWithYearPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
        return z.string({ required_error: m.IS_REQUIRED }).regex(monthWithYearPattern, m.MONTH_WITH_YEAR);
    }

    /**
     * Validate year only format (YYYY)
     * @returns Zod string validator with regex pattern for YYYY
     * @example "2025", "2023"
     */
    private validateYearOnly(): ZodString {
        const yearOnlyPattern = /^\d{4}$/;
        return z.string({ required_error: m.IS_REQUIRED }).regex(yearOnlyPattern, m.YEAR_ONLY);
    }

    // Date ISO
    private validateDateISO(): z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, unknown> {
        let base = z.preprocess(
            (str) => {
                if (str === undefined) return undefined;
                if (typeof str == "object") return str;
                const temp = String(str);
                const isoDateRegex =
                    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{3})?Z?$/;
                if (!isoDateRegex.test(temp)) return "";
                const date = new Date(temp);
                return date;
            },
            z.date({ required_error: m.REQUIRED, invalid_type_error: m.DATE }).refine(
                (str) => {
                    return !Number.isNaN(str.getTime());
                },
                {
                    message: m.DATE,
                },
            ),
        );
        return base;
    }

    private validateBigInt(): z.ZodEffects<z.ZodBigInt, bigint, unknown> {
        let base = z.preprocess(
            (val) => {
                if (val === undefined) return undefined;
                if (typeof val === "bigint") return val;
                try {
                    return BigInt(val as string | number);
                } catch (error) {
                    return "";
                }
            },
            z.bigint({ required_error: m.IS_REQUIRED, invalid_type_error: m.BIGINT }),
        );
        return base;
    }

    private validateDecimal() {
        const { precision = 10, scale = 2 } = this.config;
        const maxIntegerDigits = precision - scale;
        const pattern = new RegExp(`^-?\\d{0,${maxIntegerDigits}}(\\.\\d{0,${scale}})?$`);

        return z
            .union([z.string(), z.number()])
            .refine((val) => {
                const str = val.toString();
                return pattern.test(str);
            }, `Invalid decimal format (max ${precision} digits, ${scale} decimal places)`)
            .transform((val) => {
                const num = Number.parseFloat(val.toString());
                if (Number.isNaN(num)) {
                    throw new Error("Invalid decimal value");
                }
                return Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale);
            });
    }

    private validateDouble(): z.ZodEffects<ZodNumber, number, number> {
        return z
            .number({ invalid_type_error: m.NUMBER })
            .min(-Number.MAX_VALUE, "Number too small")
            .max(Number.MAX_VALUE, "Number too large")
            .refine((val) => Number.isFinite(val), "Must be a finite number");
    }

    private validateArrayString(): ZodArray<ZodString, "many"> {
        return z.array(z.string().min(1, m.ARRAY_STRING)).min(1, m.ARRAY_STRING);
    }

    /*
     * Date Range in format "YYYY-MM-DD,YYYY-MM-DD"
     * Returns two Date objects {startDate, endDate}
     */
    private validateStringDateRange(): z.ZodEffects<ZodString, { startDate: Date; endDate: Date }, string> {
        const pattern = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/;
        return this.validateString()
            .regex(pattern, m.STRING_DATE_RANGE)
            .transform((val) => {
                const [start, end] = val.split(",");
                const startDate = new Date(start);
                const endDate = new Date(end);
                if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
                    throw new Error(m.STRING_DATE_RANGE);
                }
                return { startDate, endDate };
            });
    }

    /**
     * Object validation
     * Allows: Object of any type
     * Blocks: Numbers, special characters
     */
    private validateObject(): ZodObject<Record<string, ZodTypeAny>> {
        if (this.config.objectConfig) {
            return ValidationService.createSchema(this.config.objectConfig);
        }
        console.warn(`Field '${this.fieldName}' has type '${v.OBJECT}' but no 'objectConfig' was provided. `);
        return z.object({});
    }

    // Custom Validators can be added here
    private branchCodeFormat(): ZodString {
        const pattern = /^\d{2}-[A-Z]{2}$/;
        return this.validateString().regex(pattern, m.BRANCH_CODE_FORMAT);
    }
}

type ZodFormattedError<T> = {
    [K in keyof T]?: T[K] extends (infer U)[]
        ? U extends object
            ? Array<{ _index: number } & ZodFormattedError<U>>
            : Array<{ _index: number } & { [key: string]: any }>
        : T[K] extends object
          ? ZodFormattedError<T[K]>
          : string | { [key: string]: any };
};

class ValidationService {
    public static createSchema(fields: Record<string, FieldConfigType>): ZodObject<Record<string, ZodTypeAny>> {
        const schemaObject = Object.entries(fields).reduce(
            (acc, [field, config]) => {
                const validator = new Validator(field, config);
                acc[field] = validator.getValidator();
                return acc;
            },
            {} as Record<string, ZodTypeAny>,
        );

        return z.object(schemaObject);
    }

    private static buildNestedError<T>(
        formattedErrors: ZodFormattedError<T>,
        path: (string | number)[],
        errorObject: any,
    ) {
        if (path.length === 0) return;

        const [key, ...restOfPath] = path;
        const nextIsNumber = typeof restOfPath[0] === "number";

        if (nextIsNumber) {
            const fieldKey = key as keyof T;
            const arr = (formattedErrors[fieldKey] ?? []) as any[];

            const index = restOfPath[0] as number;
            let existingItem = arr.find((item) => item._index === index);

            if (!existingItem) {
                existingItem = { _index: index };
                arr.push(existingItem);
            }

            formattedErrors[fieldKey] = arr as any;

            if (restOfPath.length === 1) {
                if (typeof errorObject === "string") {
                    existingItem["_error"] = errorObject;
                } else {
                    Object.assign(existingItem, errorObject);
                }
            } else {
                this.buildNestedError(existingItem, restOfPath.slice(1), errorObject);
            }
        } else {
            const fieldKey = key as keyof T;
            if (restOfPath.length === 0) {
                (formattedErrors as any)[fieldKey] = errorObject;
            } else {
                formattedErrors[fieldKey] ??= {} as any;
                this.buildNestedError(formattedErrors[fieldKey] as ZodFormattedError<any>, restOfPath, errorObject);
            }
        }
    }

    /**
     * Validate data against a set of field configurations.
     * @template U - The type of the field configurations.
     * @template T - The type of the data to validate.
     * @param {U} fields - The field configurations.
     * @param {T} data - The data to validate.
     * @returns {Promise<{ isValid: boolean; data: T | Record<string, any>; errors: Record<string, any> | null }>} - The validation result.
     * @example
     * const fields = {
     *     name: { type: v.NO_PROHIBITED_CHARACTERS, required: true, minLength: 2, maxLength: 80 },
     * };
     * const data = {
     *     name: "Disease",
     * };
     * const result = ValidationService.validate(fields, data);
     * @example
     * Error Response
     *     invalidValue: { name: "InvalidProhibitedCharacters" },
     *
     *     minLength: { name: { _error: "InvalidMinimumCharacters", _min: 2 } },
     *
     *     maxLength: { name: { _error: "InvalidMaximumCharacters", _max: 80 } },
     *
     *     required: { name: "Required" },
     */
    public static validate<U extends Record<string, FieldConfigType>, T extends object>(fields: U, data: T) {
        const schema = this.createSchema(fields);
        try {
            const validatedData = schema.parse(data);
            return { isValid: true, data: validatedData, errors: null };
        } catch (err) {
            if (err instanceof ZodError) {
                const formattedErrors: ZodFormattedError<T> = {};
                err.errors.forEach((e: ZodIssue) => {
                    let errorObject: any = e.message;

                    if (e.code === "too_small" || e.code === "too_big") {
                        errorObject = { _error: e.message };
                        if (e.code === "too_small" && e.minimum !== undefined) {
                            errorObject._min = e.minimum;
                        }
                        if (e.code === "too_big" && e.maximum !== undefined) {
                            errorObject._max = e.maximum;
                        }
                    }

                    this.buildNestedError(formattedErrors, e.path, errorObject);
                });

                return { isValid: false, data: null, errors: formattedErrors };
            }
            throw err;
        }
    }
}

// Export the main validation function
export const validated = <U extends Record<string, FieldConfigType>, T extends object>(fields: U, data: T) => {
    return ValidationService.validate(fields, data);
};
