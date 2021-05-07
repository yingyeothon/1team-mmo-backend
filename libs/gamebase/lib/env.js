"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    redisHost: process.env.REDIS_HOST,
    redisPassword: process.env.REDIS_PASSWORD,
    gameActorLambdaName: process.env.GAME_ACTOR_LAMBDA_NAME,
    isOffline: !!process.env.IS_OFFLINE,
    webSocketEndpoint: process.env.WS_ENDPOINT,
};
//# sourceMappingURL=env.js.map