"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signedInput = void 0;
const zod_1 = require("zod");
exports.signedInput = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().optional(),
});
