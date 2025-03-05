export enum STATUS_CODES {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401, // Fix: 401 is Unauthorized, 403 is Forbidden
    JWT_MISSING = 401,
    FORBIDDEN = 403,
    INTERNAL_ERROR = 500
}
