import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import BadRequest from "./responses/BadRequest";
import { ConsoleLogger } from "@yingyeothon/logger";
import OK from "./responses/OK";
import actorEnqueue from "@yingyeothon/actor-system/lib/actor/enqueue";
import actorRedisPush from "@yingyeothon/actor-system-redis-support/lib/queue/push";
import loadActorStartEvent from "../actor/loadActorStartEvent";
import redisGet from "@yingyeothon/naive-redis/lib/get";
import redisSet from "@yingyeothon/naive-redis/lib/set";
import useRedis from "../infra/useRedis";

const expirationMillis = 900 * 1000;
const logger = new ConsoleLogger("debug");

export default async function handleConnect({
  event,
  connectionIdAndGameIdKeyPrefix,
  actorEventKeyPrefix,
  actorQueueKeyPrefix,
}: {
  event: APIGatewayProxyEvent;
  connectionIdAndGameIdKeyPrefix: string;
  actorEventKeyPrefix: string;
  actorQueueKeyPrefix: string;
}): Promise<APIGatewayProxyResult> {
  function getParameter(key: string) {
    return event.headers[key] ?? (event.queryStringParameters ?? {})[key];
  }

  const { connectionId } = event.requestContext;
  // A client should send a "X-GAME-ID" via HTTP Header.
  const gameId = getParameter("x-game-id");
  const memberId = getParameter("x-member-id");

  // Validate starting information.
  if (!gameId || !memberId) {
    logger.error({ connectionId }, "Invalid gameId from connection");
    return BadRequest;
  }

  const response = await useRedis(async (redisConnection) => {
    const startEvent = await loadActorStartEvent({
      gameId,
      get: (key) => redisGet(redisConnection, key),
      eventKeyPrefix: actorEventKeyPrefix,
    });
    if (startEvent === null) {
      logger.error({ gameId }, "Invalid game context from gameId");
      return BadRequest;
    }
    if (startEvent.members.every((m) => m.memberId !== memberId)) {
      logger.error({ startEvent, memberId }, "Not registered member");
      return BadRequest;
    }

    // Register connection and start a game.
    await redisSet(
      redisConnection,
      connectionIdAndGameIdKeyPrefix + connectionId,
      gameId,
      { expirationMillis }
    );
    await actorEnqueue(
      {
        id: gameId,
        queue: actorRedisPush({
          connection: redisConnection,
          keyPrefix: actorQueueKeyPrefix,
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
    logger.info({ gameId, connectionId }, "Game logged");
    return OK;
  });
  return response;
}
