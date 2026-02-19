export enum ResponseTitleEnum {
    INFO = "Info",
    SUCCESS = "Success",
    MULTI_STATUS = "Multi-Status",
    WARNING = "Warning",
    ERROR = "Error",
    VALIDATION_ERROR = "Validation Error",
    UNAUTHENTICATED_ERROR = "Unauthenticated Error",
    FORBIDDEN_ERROR = "Forbidden Error",
    NOT_FOUND_ERROR = "Not Found Error",
    INTERNAL_SERVER_ERROR = "Internal Server Error",
    RATE_LIMIT_ERROR = "Rate Limit Error",
    DATABASE_ERROR = "Database Error",
    MODULE_ERROR = "Module Error",
    REPOSITORY_ERROR = "Repository Error",
    ENTITY_ERROR = "Entity Error",
    SERVICE_ERROR = "Service Error",
}

export enum ResponseStatusCodeEnum {
    // Success Responses (2xx)
    SUCCESS = 200,
    CREATED = 201,
    MULTI_STATUS = 207,
    // Redirection (3xx)
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,

    // Client Errors (4xx)
    BAD_REQUEST = 400,
    UNAUTHENTICATED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,

    // Server Errors (5xx)
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}
export enum ResponseMessageEnum {
    // Success Messages
    SUCCESS = "Operation completed successfully.",
    CREATED = "Resource created successfully.",
    UPDATED = "Resource updated successfully.",
    DELETED = "Resource deleted successfully.",
    ACCEPTED = "Request has been accepted for processing.",
    NO_CONTENT = "No content available.",

    // Validation Messages
    VALIDATION_ERROR = "Validation failed. Please check your input.",
    INVALID_INPUT = "The provided input is invalid.",
    MISSING_FIELDS = "Required fields are missing or incomplete, Ensure all required fields are provided.",
    INVALID_EMAIL = "The email format is incorrect.",
    INVALID_PHONE = "The phone number format is incorrect.",
    INVALID_PASSWORD = "Password does not meet security requirements.",
    INVALID_ID = "The id format is incorrect.",
    INVALID_FORMAT = "The proviced input is invalid format.",

    // Duplicate data
    DUPLICATED_EMAIL = "This email already used, Please check your input email again.",

    // Query Error
    ID_NOT_FOUND = "The provided id is not found, Please check your input id.",

    // Authentication & Authorization
    UNAUTHENTICATED = "Unauthorized token error. You are not authorized to access this resource.",
    FORBIDDEN = "You do not have permission to perform this action.",
    INVALID_CREDENTIALS = "Invalid username or password.",
    ACCOUNT_LOCKED = "Your account is locked due to multiple failed attempts.",
    SESSION_EXPIRED = "Your session has expired. Please log in again.",
    KEY_NOT_FOUND = "Key not found for token verification. Ensure service Key not found for token verification. Ensure service properly configured.",
    INVALID_TOKEN = "Invalid token.",
    TOKEN_EXPIRED_ERROR = "Token has expired.",
    DECODE_TOKEN_ERROR = "Token decoding failed. Unexpected error occurred.",
    // Token format
    BRANCH_ID_PARSING_ERROR = "Error parsing branch id from token",
    // Client Errors
    BAD_REQUEST = "The request was invalid or cannot be served.",
    NOT_FOUND = "The requested resource was not found.",
    METHOD_NOT_ALLOWED = "This HTTP method is not allowed on this endpoint.",
    CONFLICT = "The request conflicts with the current state of the resource.",
    TOO_MANY_REQUESTS = "Too many requests. Please try again later.",
    REQUEST_TIMEOUT = "The request timed out. Please try again.",
    RESOURCE_EXISTS = "The resource already exists.",

    // Rate Limiting & API Restrictions
    RATE_LIMIT_EXCEEDED = "You have exceeded the allowed number of requests.",
    API_KEY_INVALID = "The provided API key is invalid.",
    API_ACCESS_DENIED = "Access to this API is restricted.",

    // Server Errors
    INTERNAL_SERVER_ERROR = "An unexpected error occurred on the server.",
    SERVICE_UNAVAILABLE = "The service is currently unavailable. Please try again later.",
    GATEWAY_TIMEOUT = "The server did not receive a timely response.",
    DATABASE_ERROR = "A database error occurred.",
    EXTERNAL_SERVICE_ERROR = "An external service error occurred.",
    SERVICE_CONFIGURED_ERROR = "The service is not properly configured.",

    // Method Error Message
    //customer
    CREATE_CUSTOMER_FAILED = "Failed to create customer.",
    BULK_CREATE_CUSTOMER_FAILED = "Failed to create customers.",
    GET_ALL_CUSTOMER_FAILED = "Failed to retrieve all customers data.",
    GET_LIST_CUSTOMER_FAILED = "Failed to retrieve list of customers data.",
    GET_ONE_CUSTOMER_FAILED = "Failed to retrieve customer data.",
    GET_BY_NAME_CUSTOMER_FAILED = "Failed to retrieve customers by name.",
    UPDATE_CUSTOMER_FAILED = "Failed to update customer.",
    DELETE_CUSTOMER_FAILED = "Failed to delete customer.",

    //employee
    CREATE_EMPLOYEE_FAILED = "Failed to create employee.",
    BULK_CREATE_EMPLOYEE_FAILED = "Failed to create employees.",
    GET_ALL_EMPLOYEE_FAILED = "Failed to retrieve all employees data.",
    GET_LIST_EMPLOYEE_FAILED = "Failed to retrieve list of employees data.",
    GET_ONE_EMPLOYEE_FAILED = "Failed to retrieve employee data.",
    GET_BY_NAME_EMPLOYEE_FAILED = "Failed to retrieve employees by name.",
    UPDATE_EMPLOYEE_FAILED = "Failed to update employee.",
    DELETE_EMPLOYEE_FAILED = "Failed to delete employee.",

    //product
    CREATE_PRODUCT_FAILED = "Failed to create product.",
    BULK_CREATE_PRODUCT_FAILED = "Failed to create products.",
    GET_ALL_PRODUCT_FAILED = "Failed to retrieve all products data.",
    GET_LIST_PRODUCT_FAILED = "Failed to retrieve list of products data.",
    GET_ONE_PRODUCT_FAILED = "Failed to retrieve product data.",
    GET_BY_NAME_PRODUCT_FAILED = "Failed to retrieve products by name.",
    UPDATE_PRODUCT_FAILED = "Failed to update product.",
    DELETE_PRODUCT_FAILED = "Failed to delete product.",

    //inventory
    CREATE_INVENTORY_FAILED = "Failed to create inventory.",
    BULK_CREATE_INVENTORY_FAILED = "Failed to create inventories.",
    GET_ALL_INVENTORY_FAILED = "Failed to retrieve all inventories data.",
    GET_LIST_INVENTORY_FAILED = "Failed to retrieve list of inventories data.",
    GET_ONE_INVENTORY_FAILED = "Failed to retrieve inventory data.",
    GET_BY_NAME_INVENTORY_FAILED = "Failed to retrieve inventories by name.",
    UPDATE_INVENTORY_FAILED = "Failed to update inventory.",
    DELETE_INVENTORY_FAILED = "Failed to delete inventory.",

    //transaction
    CREATE_TRANSACTION_FAILED = "Failed to create transaction.",
    BULK_CREATE_TRANSACTION_FAILED = "Failed to create transactions.",
    GET_ALL_TRANSACTION_FAILED = "Failed to retrieve all transactions data.",
    GET_LIST_TRANSACTION_FAILED = "Failed to retrieve list of transactions data.",
    GET_ONE_TRANSACTION_FAILED = "Failed to retrieve transaction data.",
    UPDATE_TRANSACTION_FAILED = "Failed to update transaction.",
    DELETE_TRANSACTION_FAILED = "Failed to delete transaction.",

    //transaction item
    CREATE_TRANSACTION_ITEM_FAILED = "Failed to create transaction item.",
    BULK_CREATE_TRANSACTION_ITEM_FAILED = "Failed to create transaction items.",
    GET_ALL_TRANSACTION_ITEM_FAILED = "Failed to retrieve all transaction items data.",
    GET_LIST_TRANSACTION_ITEM_FAILED = "Failed to retrieve list of transaction items data.",
    GET_ONE_TRANSACTION_ITEM_FAILED = "Failed to retrieve transaction item data.",
    UPDATE_TRANSACTION_ITEM_FAILED = "Failed to update transaction item.",
    DELETE_TRANSACTION_ITEM_FAILED = "Failed to delete transaction item.",

    //analytics
    GET_SALES_SUMMARY_FAILED = "Failed to retrieve sales summary.",
    GET_TOP_PRODUCTS_FAILED = "Failed to retrieve top selling products.",
    GET_LOW_STOCK_INVENTORY_FAILED = "Failed to retrieve low stock inventory.",
    GET_PENDING_PAYMENTS_FAILED = "Failed to retrieve pending payments.",

    // Entity Error Message
    ENTITY_INITAILIZE_ERROR = "Failed to initialize entity.",
    ENTITY_VALIDATE_ERROR = "Failed to validate entity.",
}
