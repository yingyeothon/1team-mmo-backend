import GameActorStartEvent from "./models/GameActorStartEvent";
export default function saveActorStartEvent({ event, set, eventKeyPrefix, }: {
    event: GameActorStartEvent;
    set: (key: string, value: string) => Promise<any>;
    eventKeyPrefix: string;
}): Promise<boolean>;
//# sourceMappingURL=saveActorStartEvent.d.ts.map