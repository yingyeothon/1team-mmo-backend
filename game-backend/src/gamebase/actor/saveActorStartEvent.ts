import GameActorStartEvent from "./models/GameActorStartEvent";

export default async function saveActorStartEvent({
  event,
  set,
  eventKeyPrefix,
}: {
  event: GameActorStartEvent;
  set: (key: string, value: string) => Promise<any>;
  eventKeyPrefix: string;
}): Promise<boolean> {
  if (!event.gameId) {
    return false;
  }
  await set(eventKeyPrefix + event.gameId, JSON.stringify(event));
  return true;
}
