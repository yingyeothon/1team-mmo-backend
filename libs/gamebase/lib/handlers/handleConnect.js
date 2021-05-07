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
const loadActorStartEvent_1 = __importDefault(require("../actor/loadActorStartEvent"));
const get_1 = __importDefault(require("@yingyeothon/naive-redis/lib/get"));
const set_1 = __importDefault(require("@yingyeothon/naive-redis/lib/set"));
const useRedis_1 = __importDefault(require("../infra/useRedis"));
const expirationMillis = 900 * 1000;
const logger = new logger_1.ConsoleLogger("debug");
async function handleConnect({ event, connectionIdAndGameIdKeyPrefix, actorEventKeyPrefix, actorQueueKeyPrefix, }) {
    const { connectionId } = event.requestContext;
    const getParameter = (key) => { var _a, _b; return (_a = event.headers[key]) !== null && _a !== void 0 ? _a : ((_b = event.queryStringParameters) !== null && _b !== void 0 ? _b : {})[key]; };
    const response = await useRedis_1.default(async (redisConnection) => {
        const gameId = getParameter("x-game-id");
        const memberId = getParameter("x-member-id");
        if (!gameId || !memberId) {
            logger.error({ connectionId }, "Invalid gameId from connection");
            return NotFound_1.default;
        }
        const startEvent = await loadActorStartEvent_1.default({
            gameId,
            get: (key) => get_1.default(redisConnection, key),
            eventKeyPrefix: actorEventKeyPrefix,
        });
        if (startEvent === null) {
            logger.error({ gameId }, "Invalid game context from gameId");
            return NotFound_1.default;
        }
        if (startEvent.members.every((m) => m.memberId !== memberId)) {
            logger.error({ startEvent, memberId }, "Not registered member");
            return NotFound_1.default;
        }
        await set_1.default(redisConnection, connectionIdAndGameIdKeyPrefix + connectionId, gameId, { expirationMillis });
        await enqueue_1.default({
            id: gameId,
            queue: push_1.default({
                connection: redisConnection,
                keyPrefix: actorQueueKeyPrefix,
                logger,
            }),
            logger,
        }, {
            item: {
                type: "enter",
                connectionId,
                memberId,
            },
        });
        logger.info({ gameId, connectionId }, "Game logged");
        return OK_1.default;
    });
    return response;
}
exports.default = handleConnect;
//# sourceMappingURL=handleConnect.js.map