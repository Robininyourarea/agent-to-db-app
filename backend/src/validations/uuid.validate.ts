import { FieldConfigMap } from "@/types/validation/validate.type";
import { UUIDRequest } from "@/types/uuid/request.type";
import { ResponseValidationTypeEnum as v } from "@/enum/validate.enum";

export const uuidValidateConfig: FieldConfigMap<UUIDRequest> = {
    uuid: { type: v.UUID, required: true },
};
