"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearActorStartEvent = void 0;
async function clearActorStartEvent({ gameId, del, eventKeyPrefix, }) {
    return del(eventKeyPrefix + gameId);
}
exports.clearActorStartEvent = clearActorStartEvent;
//# sourceMappingURL=clearActorStartEvent.js.map