"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventLoop_1 = __importDefault(require("@yingyeothon/actor-system/lib/actor/eventLoop"));
const clearActorStartEvent_1 = require("./clearActorStartEvent");
const del_1 = __importDefault(require("@yingyeothon/naive-redis/lib/del"));
async function startActorLoop({ gameId, members, subsys, logger, eventKeyPrefix, redisConnection, gameMain, }) {
    await eventLoop_1.default({
        ...subsys,
        id: gameId,
        loop: async (poll) => {
            logger.info({ gameId, members }, "Start a game with id");
            async function pollMessages() {
                const messages = await poll();
                if (messages.length > 0) {
                    logger.info({ messages }, "Process game messages");
                }
                return messages;
            }
            try {
                await gameMain({ gameId, members, pollMessages });
            }
            catch (error) {
                logger.error({ gameId, error }, "Unexpected error from game");
            }
            logger.info({ gameId, members }, "End of the game");
            await clearActorStartEvent_1.clearActorStartEvent({
                gameId,
                del: (key) => del_1.default(redisConnection, key),
                eventKeyPrefix,
            });
        },
    });
}
exports.default = startActorLoop;
//# sourceMappingURL=startActorLoop.js.map