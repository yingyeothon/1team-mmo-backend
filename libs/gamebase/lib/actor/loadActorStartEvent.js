"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function loadActorStartEvent({ gameId, get, eventKeyPrefix, }) {
    const value = await get(eventKeyPrefix + gameId);
    if (value === null) {
        return null;
    }
    try {
        const event = JSON.parse(value);
        if (!event.gameId) {
            return null;
        }
        return event;
    }
    catch (error) {
    }
    return null;
}
exports.default = loadActorStartEvent;
//# sourceMappingURL=loadActorStartEvent.js.map