import keyPrefixOfEvent from "../env/keyPrefixOfEvent";

export interface GameMember {
  memberId: string;
  name: string;
  email: string;
  observer?: boolean;
}

export interface GameActorStartEvent {
  gameId: string;
  members: GameMember[];
  callbackUrl?: string;
}

export async function saveActorStartEvent({
  event,
  set,
}: {
  event: GameActorStartEvent;
  set: (key: string, value: string) => Promise<any>;
}): Promise<boolean> {
  if (!event.gameId) {
    return false;
  }
  await set(keyPrefixOfEvent + event.gameId, JSON.stringify(event));
  return true;
}

export async function loadActorStartEvent({
  gameId,
  get,
}: {
  gameId: string;
  get: (key: string) => Promise<string | null>;
}): Promise<GameActorStartEvent | null> {
  const value = await get(keyPrefixOfEvent + gameId);
  if (value === null) {
    return null;
  }
  try {
    const event = JSON.parse(value) as GameActorStartEvent;
    if (!event.gameId) {
      return null;
    }
    return event;
  } catch (error) {
    // Ignore
  }
  return null;
}

export async function clearActorStartEvent({
  gameId,
  del,
}: {
  gameId: string;
  del: (key: string) => Promise<any>;
}) {
  return del(keyPrefixOfEvent + gameId);
}
