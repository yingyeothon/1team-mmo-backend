"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_gamebase_1 = require("@yingyeothon/lambda-gamebase");
async function broadcastStage({ context, stage, age, }) {
    await lambda_gamebase_1.broadcast(Object.keys(context.connectedUsers), {
        type: "stage",
        payload: { stage, age },
    });
}
exports.default = broadcastStage;
//# sourceMappingURL=broadcastStage.js.map