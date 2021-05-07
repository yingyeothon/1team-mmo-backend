"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_gamebase_1 = require("@yingyeothon/lambda-gamebase");
async function processEnter({ context, message: { connectionId, memberId }, }) {
    const newbie = context.users.find((u) => u.memberId === memberId);
    const observer = context.observers.find((o) => o.memberId === memberId);
    if (observer) {
        observer.connectionId = connectionId;
    }
    else if (newbie) {
        newbie.connectionId = connectionId;
        newbie.load = false;
        context.connectedUsers[connectionId] = newbie;
        await lambda_gamebase_1.broadcast(Object.keys(context.connectedUsers), {
            type: "enter",
            payload: { memberId },
        });
    }
}
exports.default = processEnter;
//# sourceMappingURL=processEnter.js.map