import {
  GameActorStartEvent,
  clearActorStartEvent,
  saveActorStartEvent,
} from "../shared/actorRequest";

import { ConsoleLogger } from "@yingyeothon/logger";
import Game from "./game";
import { GameRequest } from "../shared/gameRequest";
import { Handler } from "aws-lambda";
import actorEventLoop from "@yingyeothon/actor-system/lib/actor/eventLoop";
import actorSubsys from "./actorSubsys";
import gameAliveSeconds from "./env/gameAliveSeconds";
import readyCall from "../lobby/readyCall";
import redisConnection from "./redisConnection";
import redisDel from "@yingyeothon/naive-redis/lib/del";
import redisSet from "@yingyeothon/naive-redis/lib/set";

const logger = new ConsoleLogger(`debug`);

export const handle: Handler<GameActorStartEvent, void> = async (event) => {
  logger.debug(`Start a new game lambda`, event);

  const { gameId, members } = event;
  if (!gameId) {
    logger.error(`No gameId from payload`, event);
    return;
  }

  // First, store game context into Redis.
  await saveActorStartEvent({
    event,
    set: (key, value) =>
      redisSet(redisConnection, key, value, {
        expirationMillis: gameAliveSeconds * 1000,
      }),
  });

  // Send the ready signal to the Lobby.
  if (event.callbackUrl !== undefined) {
    const response = await readyCall(event.callbackUrl);
    logger.debug(`Mark this game as ready`, response);
  }

  // Start the game loop.
  await actorEventLoop<GameRequest>({
    ...actorSubsys,
    id: gameId,
    loop: async (poll) => {
      logger.info(`Start a game with id`, gameId, members);
      const game = new Game(gameId, members, async () => {
        const messages = await poll();
        if (messages.length > 0) {
          logger.info(`Process game messages`, messages);
        }
        return messages;
      });
      try {
        await game.run();
      } catch (error) {
        logger.error(`Unexpected error from game`, gameId, error);
      }
      logger.info(`End of the game`, gameId, members);
      await clearActorStartEvent({
        gameId,
        del: (key) => redisDel(redisConnection, key),
      });
    },
  });
};
