"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const NotFound_1 = __importDefault(require("./responses/NotFound"));
const OK_1 = __importDefault(require("./responses/OK"));
const enqueue_1 = __importDefault(require("@yingyeothon/actor-system/lib/actor/enqueue"));
const push_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/queue/push"));
const redisConnection_1 = __importDefault(require("../infra/redisConnection"));
const get_1 = __importDefault(require("@yingyeothon/naive-redis/lib/get"));
const logger = new logger_1.ConsoleLogger("debug");
async function handleMessages({ event, connectionIdAndGameIdKeyPrefix, actorQueueKeyPrefix, validateMessage, }) {
    if (!event.body) {
        return NotFound_1.default;
    }
    const { connectionId } = event.requestContext;
    let request;
    try {
        request = JSON.parse(event.body);
        if (!validateMessage(request)) {
            logger.error({ connectionId, request }, "Invalid message");
            return NotFound_1.default;
        }
    }
    catch (error) {
        logger.error({ connectionId, request, error }, "Invalid message");
        return NotFound_1.default;
    }
    const gameId = await get_1.default(redisConnection_1.default, connectionIdAndGameIdKeyPrefix + connectionId);
    logger.info({ connectionId, gameId }, "Game id");
    if (!gameId) {
        logger.error({ connectionId }, "No GameID for connection");
        return NotFound_1.default;
    }
    await enqueue_1.default({
        id: gameId,
        queue: push_1.default({
            connection: redisConnection_1.default,
            keyPrefix: actorQueueKeyPrefix,
            logger,
        }),
        logger,
    }, { item: { ...request, connectionId } });
    logger.info({ connectionId, gameId, request }, "Game message sent");
    return OK_1.default;
}
exports.default = handleMessages;
//# sourceMappingURL=handleMessages.js.map