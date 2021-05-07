"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const reply_1 = __importDefault(require("./reply"));
const logger = new logger_1.ConsoleLogger(process.env.STAGE === "production" ? "info" : "debug");
async function broadcast(connectionIds, response) {
    const result = await Promise.all(connectionIds.map((connectionId) => reply_1.default(connectionId, response).then((success) => ({
        connectionId,
        success,
    }))));
    const map = result.reduce((all, each) => Object.assign(all, each), {});
    logger.info({ connectionIds, response, map }, "Broadcast");
    return map;
}
exports.default = broadcast;
//# sourceMappingURL=broadcast.js.map