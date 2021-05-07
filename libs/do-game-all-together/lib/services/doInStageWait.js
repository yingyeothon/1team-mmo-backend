"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_gamebase_1 = require("@yingyeothon/lambda-gamebase");
const GameStage_1 = __importDefault(require("../models/GameStage"));
const broadcastStage_1 = __importDefault(require("./broadcastStage"));
const processEnterLeave_1 = __importDefault(require("./processEnterLeave"));
async function doInStageWait({ context, gameWaitingSeconds, loopInterval, pollMessages: pollMessages, logger, }) {
    logger.info({ context }, "Start of wait stage");
    function isAllConnected() {
        return Object.keys(context.connectedUsers).length === context.users.length;
    }
    const ticker = new lambda_gamebase_1.Ticker(GameStage_1.default.Wait, gameWaitingSeconds * 1000);
    while (ticker.isAlive() && !isAllConnected()) {
        const messages = await pollMessages();
        for (const message of messages) {
            try {
                await processEnterLeave_1.default({ context, message });
            }
            catch (error) {
                logger.error({ context, message, error }, "Cannot process enter-leave message");
            }
        }
        await ticker.checkAgeChanged((stage, age) => broadcastStage_1.default({ context, stage, age }));
        await lambda_gamebase_1.sleep(loopInterval);
    }
    logger.info({ context }, "End of wait stage");
    return isAllConnected();
}
exports.default = doInStageWait;
//# sourceMappingURL=doInStageWait.js.map