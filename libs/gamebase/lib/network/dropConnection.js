"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const env_1 = __importDefault(require("../env"));
const fakeConnectionId_1 = __importDefault(require("./fakeConnectionId"));
const apimgmt = new aws_sdk_1.ApiGatewayManagementApi({
    endpoint: env_1.default.isOffline ? `http://localhost:3001` : env_1.default.webSocketEndpoint,
});
async function dropConnection(connectionId) {
    if (connectionId === fakeConnectionId_1.default) {
        return true;
    }
    try {
        apimgmt
            .deleteConnection({
            ConnectionId: connectionId,
        })
            .promise();
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.default = dropConnection;
//# sourceMappingURL=dropConnection.js.map