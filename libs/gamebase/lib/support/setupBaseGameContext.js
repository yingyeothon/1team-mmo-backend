"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupBaseGameContext(members) {
    const users = members
        .filter((member) => !member.observer)
        .map((member) => ({
        connectionId: "",
        load: false,
        memberId: member.memberId,
    }));
    const observers = members
        .filter((member) => member.observer)
        .map((member) => ({
        memberId: member.memberId,
        connectionId: "",
    }));
    return { users, observers, connectedUsers: {} };
}
exports.default = setupBaseGameContext;
//# sourceMappingURL=setupBaseGameContext.js.map