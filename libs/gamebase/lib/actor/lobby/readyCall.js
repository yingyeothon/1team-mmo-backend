"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const https = __importStar(require("https"));
function readyCall(callbackUrl) {
    return httpRequest(callbackUrl, {
        method: "PUT",
    });
}
exports.default = readyCall;
function httpRequest(url, requestArgs) {
    return new Promise((resolve, reject) => {
        const request = url.startsWith("https:") ? https.request : http.request;
        const req = request(url, requestArgs, async (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`${res.statusCode} ${res.statusMessage}`));
            }
            else {
                try {
                    res.destroy();
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }
        });
        req.end();
    });
}
//# sourceMappingURL=readyCall.js.map