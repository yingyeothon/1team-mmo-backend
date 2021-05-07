import actorEventLoop, {
  ActroEventLoopEnvironment,
} from "@yingyeothon/actor-system/lib/actor/eventLoop";

import GameMainArguments from "../models/GameMainArguments";
import GameStartMember from "../models/GameStartMember";
import { Logger } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { clearActorStartEvent } from "./clearActorStartEvent";
import redisDel from "@yingyeothon/naive-redis/lib/del";

export interface StartActorLoopArgs<M> {
  gameId: string;
  members: GameStartMember[];
  eventKeyPrefix: string;
  logger: Logger;
  subsys: Omit<ActroEventLoopEnvironment<M>, "id" | "loop">;
  redisConnection: RedisConnection;
  gameMain: (args: GameMainArguments<M>) => Promise<unknown>;
}

export default async function startActorLoop<M>({
  gameId,
  members,
  subsys,
  logger,
  eventKeyPrefix,
  redisConnection,
  gameMain,
}: StartActorLoopArgs<M>): Promise<void> {
  // Start the game loop.
  await actorEventLoop<M>({
    ...subsys,
    id: gameId,
    loop: async (poll) => {
      logger.info({ gameId, members }, "Start a game with id");
      async function pollMessages() {
        const messages = await poll();
        if (messages.length > 0) {
          logger.info({ messages }, "Process game messages");
        }
        return messages;
      }

      try {
        await gameMain({ gameId, members, pollMessages });
      } catch (error) {
        logger.error({ gameId, error }, "Unexpected error from game");
      }
      logger.info({ gameId, members }, "End of the game");
      await clearActorStartEvent({
        gameId,
        del: (key) => redisDel(redisConnection, key),
        eventKeyPrefix,
      });
    },
  });
}
