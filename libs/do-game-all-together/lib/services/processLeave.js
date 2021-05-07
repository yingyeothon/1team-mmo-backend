"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processLeave({ context, message: { connectionId }, }) {
    const leaver = context.connectedUsers[connectionId];
    const observer = context.observers.find((o) => o.connectionId === connectionId);
    if (observer) {
        observer.connectionId = "";
    }
    else if (leaver) {
        leaver.connectionId = "";
        leaver.load = false;
        delete context.connectedUsers[connectionId];
    }
}
exports.default = processLeave;
//# sourceMappingURL=processLeave.js.map