export async function clearActorStartEvent({
  gameId,
  del,
  eventKeyPrefix,
}: {
  gameId: string;
  del: (key: string) => Promise<any>;
  eventKeyPrefix: string;
}) {
  return del(eventKeyPrefix + gameId);
}
