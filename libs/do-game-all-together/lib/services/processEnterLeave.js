"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processEnter_1 = __importDefault(require("./processEnter"));
const processLeave_1 = __importDefault(require("./processLeave"));
async function processEnterLeave({ context, message, }) {
    switch (message.type) {
        case "enter":
            return await processEnter_1.default({ context, message });
        case "leave":
            return processLeave_1.default({ context, message });
    }
}
exports.default = processEnterLeave;
//# sourceMappingURL=processEnterLeave.js.map