"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_gamebase_1 = require("@yingyeothon/lambda-gamebase");
const logger_1 = require("@yingyeothon/logger");
const GameStage_1 = __importDefault(require("./models/GameStage"));
const broadcastStage_1 = __importDefault(require("./services/broadcastStage"));
const doInStageRunning_1 = __importDefault(require("./services/doInStageRunning"));
const doInStageWait_1 = __importDefault(require("./services/doInStageWait"));
async function runGameAllTogether({ gameId, members, pollMessages, gameWaitingSeconds, gameRunningSeconds, isGameOver, processMessage, updateTimeDelta, loopInterval = 0, logger = new logger_1.ConsoleLogger("debug"), }) {
    const context = lambda_gamebase_1.setupBaseGameContext(members);
    try {
        const allConnected = await doInStageWait_1.default({
            context,
            gameWaitingSeconds,
            loopInterval,
            pollMessages,
            logger,
        });
        if (allConnected) {
            await doInStageRunning_1.default({
                context,
                gameRunningSeconds,
                loopInterval,
                isGameOver,
                processMessage,
                updateTimeDelta,
                pollMessages,
                logger,
            });
        }
    }
    catch (error) {
        logger.error({ gameId, context, error }, "Error in game loop");
    }
    await broadcastStage_1.default({
        context,
        age: gameRunningSeconds,
        stage: GameStage_1.default.End,
    });
    await Promise.all(Object.keys(context.connectedUsers).map((connectionId) => lambda_gamebase_1.dropConnection(connectionId)));
    logger.info({ gameId, members }, "Game end");
}
exports.default = runGameAllTogether;
//# sourceMappingURL=runGameAllTogether.js.map