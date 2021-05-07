import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { ConsoleLogger } from "@yingyeothon/logger";
import OK from "./responses/OK";
import actorEnqueue from "@yingyeothon/actor-system/lib/actor/enqueue";
import actorRedisPush from "@yingyeothon/actor-system-redis-support/lib/queue/push";
import redisDel from "@yingyeothon/naive-redis/lib/del";
import redisGet from "@yingyeothon/naive-redis/lib/get";
import useRedis from "../infra/useRedis";

const logger = new ConsoleLogger("debug");

export default async function handleDisconnect({
  event,
  connectionIdAndGameIdKeyPrefix,
  actorQueueKeyPrefix,
}: {
  event: APIGatewayProxyEvent;
  connectionIdAndGameIdKeyPrefix: string;
  actorQueueKeyPrefix: string;
}): Promise<APIGatewayProxyResult> {
  // Read gameId related this connectionId.
  const { connectionId } = event.requestContext;
  await useRedis(async (redisConnection) => {
    const gameId: string | null = await redisGet(
      redisConnection,
      connectionIdAndGameIdKeyPrefix + connectionId
    );
    logger.info({ connectionId, gameId }, "Game id");

    // Send a leave message to Redis Q and delete (gameId, connectionId).
    if (!gameId) {
      return;
    }
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
      { item: { type: "leave", connectionId } }
    );
    await redisDel(
      redisConnection,
      connectionIdAndGameIdKeyPrefix + connectionId
    );
    logger.info({ connectionId, gameId }, "Cleanup and game leaved");
  });
  return OK;
}
