"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const aws_sdk_1 = require("aws-sdk");
const NotFound_1 = __importDefault(require("./responses/NotFound"));
const OK_1 = __importDefault(require("./responses/OK"));
const env_1 = __importDefault(require("../env"));
const release_1 = __importDefault(require("@yingyeothon/actor-system-redis-support/lib/lock/release"));
const useRedis_1 = __importDefault(require("../infra/useRedis"));
const logger = new logger_1.ConsoleLogger("debug");
async function handleDebugStart({ event, actorLockKeyPrefix, }) {
    var _a;
    if (!env_1.default.isOffline || !event.body) {
        return NotFound_1.default;
    }
    const startEvent = JSON.parse(event.body);
    logger.debug({ startEvent }, "Start for debugging");
    await useRedis_1.default(async (redisConnection) => release_1.default({
        connection: redisConnection,
        keyPrefix: actorLockKeyPrefix,
        logger,
    }).release(startEvent.gameId));
    logger.debug({ gameId: startEvent.gameId }, "Release actor's lock");
    const promise = new aws_sdk_1.Lambda({
        endpoint: `http://localhost:3000`,
    })
        .invoke({
        FunctionName: process.env.GAME_ACTOR_LAMBDA_NAME,
        InvocationType: "Event",
        Qualifier: "$LATEST",
        Payload: JSON.stringify(startEvent),
    })
        .promise();
    if ((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.waitSetup) {
        await promise;
    }
    return OK_1.default;
}
exports.default = handleDebugStart;
//# sourceMappingURL=handleDebugStart.js.map