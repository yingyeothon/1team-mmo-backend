import { ConsoleLogger, Logger } from "@yingyeothon/logger";

import GameActorStartEvent from "./models/GameActorStartEvent";
import GameMainArguments from "../models/GameMainArguments";
import newActorSubsys from "./newActorSubsys";
import readyCall from "./lobby/readyCall";
import redisConnection from "../infra/redisConnection";
import redisSet from "@yingyeothon/naive-redis/lib/set";
import saveActorStartEvent from "./saveActorStartEvent";
import startActorLoop from "./startActorLoop";

const aliveMarginSeconds = 10;

export default async function handleActor<M>({
  event,
  eventKeyPrefix,
  awaiterKeyPrefix,
  queueKeyPrefix,
  lockKeyPrefix,
  lifetimeSeconds,
  gameMain,
  logger = new ConsoleLogger("debug"),
  actorLogger = new ConsoleLogger("info"),
}: {
  event: GameActorStartEvent;
  eventKeyPrefix: string;
  awaiterKeyPrefix: string;
  queueKeyPrefix: string;
  lockKeyPrefix: string;
  lifetimeSeconds: number;
  gameMain: (args: GameMainArguments<M>) => Promise<unknown>;
  logger?: Logger;
  actorLogger?: Logger;
}) {
  logger.debug({ event }, "Start a new game lambda");

  const { gameId, members } = event;
  if (!gameId) {
    logger.error({ event }, "No gameId from payload");
    return;
  }

  const aliveSeconds = lifetimeSeconds + aliveMarginSeconds;

  // First, store game context into Redis.
  await saveActorStartEvent({
    event,
    set: (key, value) =>
      redisSet(redisConnection, key, value, {
        expirationMillis: aliveSeconds * 1000,
      }),
    eventKeyPrefix,
  });

  // Send the ready signal to the Lobby.
  if (event.callbackUrl !== undefined) {
    const response = await readyCall(event.callbackUrl);
    logger.debug({ response }, "Mark this game as ready");
  }

  await startActorLoop({
    gameId,
    members,
    logger,
    eventKeyPrefix,
    subsys: newActorSubsys({
      awaiterKeyPrefix,
      lockKeyPrefix,
      queueKeyPrefix,
      lockTimeoutSeconds: aliveSeconds,
      logger: actorLogger,
      redisConnection,
    }),
    redisConnection,
    gameMain,
  });
}
