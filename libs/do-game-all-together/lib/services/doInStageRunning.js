"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_gamebase_1 = require("@yingyeothon/lambda-gamebase");
const GameStage_1 = __importDefault(require("../models/GameStage"));
const broadcastStage_1 = __importDefault(require("./broadcastStage"));
const processEnterLeave_1 = __importDefault(require("./processEnterLeave"));
async function doInStageRunning({ context, gameRunningSeconds, loopInterval, isGameOver, processMessage, updateTimeDelta, pollMessages, logger, }) {
    logger.info({ context }, "Start of running stage");
    const timeDelta = new lambda_gamebase_1.TimeDelta();
    const ticker = new lambda_gamebase_1.Ticker(GameStage_1.default.Running, gameRunningSeconds * 1000);
    while (ticker.isAlive() && !isGameOver({ context })) {
        const messages = await pollMessages();
        for (const message of messages) {
            try {
                if (message.type === "enter" || message.type === "leave") {
                    await processEnterLeave_1.default({ context, message });
                }
                else {
                    await processMessage({ context, message });
                }
            }
            catch (error) {
                logger.error({ context, message, error }, "Cannot process message");
            }
            if (updateTimeDelta) {
                const delta = timeDelta.getDelta();
                try {
                    await updateTimeDelta({ context, delta });
                }
                catch (error) {
                    logger.error({ context, delta, error }, "Cannot update with time-delta");
                }
            }
        }
        await ticker.checkAgeChanged((stage, age) => broadcastStage_1.default({ context, stage, age }));
        await lambda_gamebase_1.sleep(loopInterval);
    }
    logger.info({ context }, "End of running stage");
}
exports.default = doInStageRunning;
//# sourceMappingURL=doInStageRunning.js.map