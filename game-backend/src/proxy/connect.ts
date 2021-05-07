import { APIGatewayProxyHandler } from "aws-lambda";
import { ConsoleLogger } from "@yingyeothon/logger";
import actorEnqueue from "@yingyeothon/actor-system/lib/actor/enqueue";
import actorRedisPush from "@yingyeothon/actor-system-redis-support/lib/queue/push";
import actorSubsysKeys from "../env/actorSubsysKeys";
import { loadActorStartEvent } from "../shared/actorRequest";
import redisGet from "@yingyeothon/naive-redis/lib/get";
import redisKeyPrefixOfConnectionIdAndGameId from "../env/redisKeyPrefixOfConnectionIdAndGameId";
import redisSet from "@yingyeothon/naive-redis/lib/set";
import responses from "./support/responses";
import useRedis from "./support/useRedis";

const expirationMillis = 900 * 1000;
const logger = new ConsoleLogger(`debug`);

export const handle: APIGatewayProxyHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const getParameter = (key: string) =>
    event.headers[key] ?? (event.queryStringParameters ?? {})[key];
  const response = await useRedis(async (redisConnection) => {
    // A client should send a "X-GAME-ID" via HTTP Header.
    const gameId = getParameter("x-game-id");
    const memberId = getParameter("x-member-id");

    // Validate starting information.
    if (!gameId || !memberId) {
      logger.error(`Invalid gameId from connection`, connectionId);
      return responses.NotFound;
    }
    const startEvent = await loadActorStartEvent({
      gameId,
      get: (key) => redisGet(redisConnection, key),
    });
    if (startEvent === null) {
      logger.error(`Invalid game context from gameId`, gameId);
      return responses.NotFound;
    }
    if (startEvent.members.every((m) => m.memberId !== memberId)) {
      logger.error(`Not registered member`, startEvent, memberId);
      return responses.NotFound;
    }

    // Register connection and start a game.
    await redisSet(
      redisConnection,
      redisKeyPrefixOfConnectionIdAndGameId + connectionId,
      gameId,
      { expirationMillis }
    );
    await actorEnqueue(
      {
        id: gameId,
        queue: actorRedisPush({
          connection: redisConnection,
          keyPrefix: actorSubsysKeys.queueKeyPrefix,
          logger,
        }),
        logger,
      },
      {
        item: {
          type: "enter",
          connectionId,
          memberId,
        },
      }
    );
    logger.info(`Game logged`, gameId, connectionId);
    return responses.OK;
  });
  return response;
};
