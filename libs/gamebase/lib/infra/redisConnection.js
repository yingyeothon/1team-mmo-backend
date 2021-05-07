"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../env"));
const connection_1 = __importDefault(require("@yingyeothon/naive-redis/lib/connection"));
const redisConnection = connection_1.default({
    host: env_1.default.redisHost,
    password: env_1.default.redisPassword,
});
exports.default = redisConnection;
//# sourceMappingURL=redisConnection.js.map