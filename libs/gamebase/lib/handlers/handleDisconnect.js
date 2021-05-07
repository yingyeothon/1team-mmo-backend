"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const OK_1 = __importDefault(require("./responses/OK"));
const enqueue_1 = __importDefault(require("@yingyeothon/actor-system/lib/actor/enqueue"));
const push_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/queue/push"));
const del_1 = __importDefault(require("@yingyeothon/naive-redis/lib/del"));
const get_1 = __importDefault(require("@yingyeothon/naive-redis/lib/get"));
const useRedis_1 = __importDefault(require("../infra/useRedis"));
const logger = new logger_1.ConsoleLogger("debug");
async function handleDisconnect({ event, connectionIdAndGameIdKeyPrefix, actorQueueKeyPrefix, }) {
    const { connectionId } = event.requestContext;
    await useRedis_1.default(async (redisConnection) => {
        const gameId = await get_1.default(redisConnection, connectionIdAndGameIdKeyPrefix + connectionId);
        logger.info({ connectionId, gameId }, "Game id");
        if (!gameId) {
            return;
        }
        await enqueue_1.default({
            id: gameId,
            queue: push_1.default({
                connection: redisConnection,
                keyPrefix: actorQueueKeyPrefix,
                logger,
            }),
            logger,
        }, { item: { type: "leave", connectionId } });
        await del_1.default(redisConnection, connectionIdAndGameIdKeyPrefix + connectionId);
        logger.info({ connectionId, gameId }, "Cleanup and game leaved");
    });
    return OK_1.default;
}
exports.default = handleDisconnect;
//# sourceMappingURL=handleDisconnect.js.map