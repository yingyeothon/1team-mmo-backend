"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("@yingyeothon/naive-redis/lib/connection"));
const env_1 = __importDefault(require("../env"));
async function useRedis(work, { host = env_1.default.redisHost, password = env_1.default.redisPassword, } = {}) {
    const redisConnection = connection_1.default({
        host,
        password,
    });
    try {
        const result = await work(redisConnection);
        return result;
    }
    finally {
        redisConnection.socket.disconnect();
    }
}
exports.default = useRedis;
//# sourceMappingURL=useRedis.js.map