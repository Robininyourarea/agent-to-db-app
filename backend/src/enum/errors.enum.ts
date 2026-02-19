export enum ErrorTypeEnum {
    UNAUTHENTICATED_ERROR = "UnauthenticateError",
    FORBIDDEN_ERROR = "ForbiddenError",
    VALIDATION_ERROR = "ValidationError",
    NOT_FOUND_ERROR = "NotFoundError",
    INTERNAL_SERVER_ERROR = "InternalServerError",
    DATABASE_ERROR = "DatabaseError",
    RATE_LIMIT_ERROR = "RateLimitError",
    MODULE_ERROR = "ModuleError",
    ENTITY_ERROR = "EntityError",
    REPOSITORY_ERROR = "RepositoryError",
    SERVICE_ERROR = "ServiceError",
    UTILS_FUNCTION_ERROR = "UtilsFunctionError",
    QUERY_ERROR = "QueryError",
}

export enum AuthErrorEnum {
    FORBIDDEN_ERROR = "ForbiddenError",
    INVALID_CREDENTIALS = "InvalidCredentialsError",
    INVALID_EMAIL = "InvalidEmailError",
    INVALID_USERANEME = "InvalidUsernameError",
    INVALID_PASSWORD = "InvalidPasswordError",
    INVALID_USERNAME_PASSWORD = "InvalidUsernamePasswordError",
    INVALID_REFRESH_TOKEN = "InvalidRefreshTokenError",
    INVALID_TOKEN = "InvalidTokenError",
    INVALID_OTP = "InvalidOTPError",
    OTP_EXPIRED = "OTPExpiredError",
    PASSWORD_RESET_REQUIRED = "PasswordResetRequiredError",
    PASSWORD_TOO_WEAK = "PasswordTooWeakError",
}

export enum ValidationErrorEnum {
    VALIDATION_ERROR = "ValidationError",
    FILEDS_INCOMPLETE = "FieldsIncompleteError",
    INVALID_ID = "InvalidIdError",
    INVALID_INPUT = "InvalidInputError",
    INVALID_CODE = "InvalidCodeError",
    INVALID_DATE_RANGE = "InvalidDateRangeError",
    INVALID_DATE_FORMAT = "InvalidDateFormatError",
    INVALID_ROLE = "InvalidRoleError",
    INVALID_FORM = "InvalidFormError",
    INVALID_CONSENT_FORM = "InvalidConsentFormError",
    INVALID_STATUS = "InvalidStatusError",
    INVALID_MAX_LENGTH = "InvalidLengthError",
    INVALID_MIN_LENGTH = "InvalidMinLengthError",
    INVALID_ENUM = "InvalidEnumError",
    INVALID_STRING = "InvalidStringError",
    INVALID_PHONE = "InvalidPhoneError",
    INVALID_BASE64 = "InvalidBase64Error",
    INVALID_DATA_FORMAT = "InvalidDataFormatError",
    EMPTY_FIELD = "EmptyFieldError",
    FIELD_REQUIRED = "FieldRequiredError",
    FIELD_MISMATCH = "FieldMismatchError",
    INVALID_CHARACTER = "InvalidCharacterError",
    INVALID_JSON_FORMAT = "InvalidJSONFormatError",
    INVALID_EMAIL_FORMAT = "InvalidEmailFormatError",
    INVALID_NUMBER_FORMAT = "InvalidNumberFormatError",
    INVALID_BOOLEAN_VALUE = "InvalidBooleanValueError",
}

export enum DatabaseErrorEnum {
    NOT_FOUND = "NotFoundError",
    DUPLICATED_EMAIL = "DuplicatedEmailError",
    DUPLICATED_USERNAME = "DuplicatedUsernameError",
    DUPLICATED_PHONE = "DuplicatedPhoneError",
    DUPLICATED_KEY = "DuplicatedKeyError",
    DUPLICATED_MERCHANT = "DuplicatedMerchantError",
    RECORD_NOT_FOUND = "RecordNotFoundError",
    RECORD_ALREADY_EXISTS = "RecordAlreadyExistsError",
    DATABASE_TIMEOUT = "DatabaseTimeoutError",
}

export enum PermissionErrorEnum {
    PERMISSION_ERROR = "PermissionError",
    ACCESS_DENIED = "AccessDeniedError",
    INSUFFICIENT_PERMISSIONS = "InsufficientPermissionsError",
    ROLE_NOT_ALLOWED = "RoleNotAllowedError",
    RESOURCE_FORBIDDEN = "ResourceForbiddenError",
    ADMIN_ACCESS_REQUIRED = "AdminAccessRequiredError",
}

export enum RateLimitErrorEnum {
    TO_MANY_REQUEST = "TooManyRequestError",
    TO_MANY_LOGIN = "TooManyLoginError",
    TO_MANY_OTP = "TooManySendOTPError",
    API_GATEWAY = "InvalidAPIGatewayError",
    RATE_LIMIT_EXCEEDED = "RateLimitExceededError",
    TEMPORARILY_BLOCKED = "TemporarilyBlockedError",
    REQUEST_THROTTLED = "RequestThrottledError",
    API_KEY_REVOKED = "APIKeyRevokedError",
    API_KEY_EXPIRED = "APIKeyExpiredError",
    REQUEST_SIZE_LIMIT_EXCEEDED = "RequestSizeLimitExceededError",
}

export enum FileErrorEnum {
    NO_FILE_UPLOADED = "NoFileUploadedError",
    UNSUPPORT_FILE_FORMAT = "UnsupportedFileFormatError",
    FILE_TOO_LARGE = "FileTooLargeError",
    FILE_CORRUPTED = "FileCorruptedError",
    FILE_UPLOAD_TIMEOUT = "FileUploadTimeoutError",
    FILE_PATH_INVALID = "FilePathInvalidError",
    FILE_TYPE_NOT_ALLOWED = "FileTypeNotAllowedError",
    FILE_SIZE_EXCEEDED = "FileSizeExceededError",
    FILE_READ_ERROR = "FileReadError",
    FILE_WRITE_ERROR = "FileWriteError",
    STORAGE_LIMIT_EXCEEDED = "StorageLimitExceededError",
}

export enum SQLErrorEnum {
    NOT_CONNECT_SQL = "ConnectSQLError",
    SQL_ERROR = "SQLError",
    CONNECTION_TIMEOUT = "ConnectionTimeoutError",
    QUERY_SYNTAX_ERROR = "QuerySyntaxError",
    DEADLOCK_DETECTED = "DeadlockDetectedError",
    TRANSACTION_FAILED = "TransactionFailedError",
    DATABASE_UNREACHABLE = "DatabaseUnreachableError",
    TABLE_NOT_FOUND = "TableNotFoundError",
    COLUMN_NOT_FOUND = "ColumnNotFoundError",
    CONSTRAINT_VIOLATION = "ConstraintViolationError",
    LOCK_TIMEOUT = "LockTimeoutError",
}

export enum InternalServerErrorEnum {
    INTERNAL_SERVER_ERROR = "InternalServerError",
}
