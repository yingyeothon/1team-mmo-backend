import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { ConsoleLogger } from "@yingyeothon/logger";
import NotFound from "./responses/NotFound";
import OK from "./responses/OK";
import actorEnqueue from "@yingyeothon/actor-system/lib/actor/enqueue";
import actorRedisPush from "@yingyeothon/actor-system-redis-support/lib/queue/push";
import redisConnection from "../infra/redisConnection";
import redisGet from "@yingyeothon/naive-redis/lib/get";

const logger = new ConsoleLogger("debug");

export default async function handleMessages<M>({
  event,
  connectionIdAndGameIdKeyPrefix,
  actorQueueKeyPrefix,
  validateMessage,
}: {
  event: APIGatewayProxyEvent;
  connectionIdAndGameIdKeyPrefix: string;
  actorQueueKeyPrefix: string;
  validateMessage: (maybe: M) => boolean;
}): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return NotFound;
  }

  const { connectionId } = event.requestContext;

  // Parse and validate a message from the client.
  let request: any;
  try {
    // FIXME: Check if a request is valid.
    request = JSON.parse(event.body);
    if (!validateMessage(request)) {
      logger.error({ connectionId, request }, "Invalid message");
      return NotFound;
    }
  } catch (error) {
    logger.error({ connectionId, request, error }, "Invalid message");
    return NotFound;
  }

  // Read gameId related this connectionId.
  const gameId: string | null = await redisGet(
    redisConnection,
    connectionIdAndGameIdKeyPrefix + connectionId
  );
  logger.info({ connectionId, gameId }, "Game id");
  if (!gameId) {
    logger.error({ connectionId }, "No GameID for connection");
    return NotFound;
  }

  // Encode a game message and send it to Redis Q.
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
    { item: { ...request, connectionId } }
  );
  logger.info({ connectionId, gameId, request }, "Game message sent");
  return OK;
}
