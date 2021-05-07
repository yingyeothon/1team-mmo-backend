"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const logger_1 = require("@yingyeothon/logger");
const env_1 = __importDefault(require("../env"));
const fakeConnectionId_1 = __importDefault(require("../network/fakeConnectionId"));
const logger = new logger_1.ConsoleLogger(process.env.STAGE === "production" ? "info" : "debug");
const apimgmt = new aws_sdk_1.ApiGatewayManagementApi({
    endpoint: env_1.default.isOffline ? `http://localhost:3001` : env_1.default.webSocketEndpoint,
});
async function reply(connectionId, response) {
    if (connectionId === fakeConnectionId_1.default) {
        return true;
    }
    try {
        await apimgmt
            .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(response),
        })
            .promise();
        logger.debug({ connectionId, response }, "Reply");
        return true;
    }
    catch (error) {
        logger.error({ connectionId, response, error }, "Cannot reply to");
        return false;
    }
}
exports.default = reply;
//# sourceMappingURL=reply.js.map