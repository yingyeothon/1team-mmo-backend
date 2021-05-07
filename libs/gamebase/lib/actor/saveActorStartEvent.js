"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function saveActorStartEvent({ event, set, eventKeyPrefix, }) {
    if (!event.gameId) {
        return false;
    }
    await set(eventKeyPrefix + event.gameId, JSON.stringify(event));
    return true;
}
exports.default = saveActorStartEvent;
//# sourceMappingURL=saveActorStartEvent.js.map