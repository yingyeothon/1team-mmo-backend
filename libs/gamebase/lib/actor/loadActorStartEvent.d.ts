import GameActorStartEvent from "./models/GameActorStartEvent";
export default function loadActorStartEvent({ gameId, get, eventKeyPrefix, }: {
    gameId: string;
    get: (key: string) => Promise<string | null>;
    eventKeyPrefix: string;
}): Promise<GameActorStartEvent | null>;
//# sourceMappingURL=loadActorStartEvent.d.ts.map