"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const newActorSubsys_1 = __importDefault(require("./newActorSubsys"));
const readyCall_1 = __importDefault(require("./lobby/readyCall"));
const redisConnection_1 = __importDefault(require("../infra/redisConnection"));
const set_1 = __importDefault(require("@yingyeothon/naive-redis/lib/set"));
const saveActorStartEvent_1 = __importDefault(require("./saveActorStartEvent"));
const startActorLoop_1 = __importDefault(require("./startActorLoop"));
const aliveMarginSeconds = 10;
async function handleActor({ event, eventKeyPrefix, awaiterKeyPrefix, queueKeyPrefix, lockKeyPrefix, lifetimeSeconds, gameMain, logger = new logger_1.ConsoleLogger("debug"), }) {
    logger.debug({ event }, "Start a new game lambda");
    const { gameId, members } = event;
    if (!gameId) {
        logger.error({ event }, "No gameId from payload");
        return;
    }
    const aliveSeconds = lifetimeSeconds + aliveMarginSeconds;
    await saveActorStartEvent_1.default({
        event,
        set: (key, value) => set_1.default(redisConnection_1.default, key, value, {
            expirationMillis: aliveSeconds * 1000,
        }),
        eventKeyPrefix,
    });
    if (event.callbackUrl !== undefined) {
        const response = await readyCall_1.default(event.callbackUrl);
        logger.debug({ response }, "Mark this game as ready");
    }
    await startActorLoop_1.default({
        gameId,
        members,
        logger,
        eventKeyPrefix,
        subsys: newActorSubsys_1.default({
            awaiterKeyPrefix,
            lockKeyPrefix,
            queueKeyPrefix,
            lockTimeoutSeconds: aliveSeconds,
            logger,
            redisConnection: redisConnection_1.default,
        }),
        redisConnection: redisConnection_1.default,
        gameMain,
    });
}
exports.default = handleActor;
//# sourceMappingURL=handleActor.js.map