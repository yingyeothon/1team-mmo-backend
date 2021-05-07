"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/awaiter/resolve"));
const wait_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/awaiter/wait"));
const acquire_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/lock/acquire"));
const release_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/lock/release"));
const flush_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/queue/flush"));
const size_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/queue/size"));
function newActorSubsys({ awaiterKeyPrefix, queueKeyPrefix, lockKeyPrefix, lockTimeoutSeconds, redisConnection, logger, }) {
    return {
        awaiter: {
            ...resolve_1.default({
                connection: redisConnection,
                keyPrefix: awaiterKeyPrefix,
                logger,
            }),
            ...wait_1.default({
                connection: redisConnection,
                keyPrefix: awaiterKeyPrefix,
                logger,
            }),
        },
        queue: {
            ...flush_1.default({
                connection: redisConnection,
                keyPrefix: queueKeyPrefix,
                logger,
            }),
            ...size_1.default({
                connection: redisConnection,
                keyPrefix: queueKeyPrefix,
                logger,
            }),
        },
        lock: {
            ...acquire_1.default({
                connection: redisConnection,
                keyPrefix: lockKeyPrefix,
                logger,
                lockTimeout: lockTimeoutSeconds * 1000,
            }),
            ...release_1.default({
                connection: redisConnection,
                keyPrefix: lockKeyPrefix,
                logger,
            }),
        },
        logger,
    };
}
exports.default = newActorSubsys;
//# sourceMappingURL=newActorSubsys.js.map