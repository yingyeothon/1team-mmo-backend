import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { ConsoleLogger } from "@yingyeothon/logger";
import GameActorStartEvent from "../actor/models/GameActorStartEvent";
import { Lambda } from "aws-sdk";
import NotFound from "./responses/NotFound";
import OK from "./responses/OK";
import env from "../env";
import lockRelease from "@yingyeothon/actor-system-redis-support/lib/lock/release";
import useRedis from "../infra/useRedis";

const logger = new ConsoleLogger("debug");

export default async function handleDebugStart({
  event,
  actorLockKeyPrefix,
}: {
  event: APIGatewayProxyEventV2;
  actorLockKeyPrefix: string;
}): Promise<APIGatewayProxyResultV2> {
  if (!env.isOffline || !event.body) {
    return NotFound;
  }

  const startEvent = JSON.parse(event.body) as GameActorStartEvent;
  logger.debug({ startEvent }, "Start for debugging");

  await useRedis(async (redisConnection) =>
    lockRelease({
      connection: redisConnection,
      keyPrefix: actorLockKeyPrefix,
      logger,
    }).release(startEvent.gameId)
  );
  logger.debug({ gameId: startEvent.gameId }, "Release actor's lock");

  // Start a new Lambda to process game messages.
  const promise = new Lambda({
    endpoint: `http://localhost:3000`,
  })
    .invoke({
      FunctionName: process.env.GAME_ACTOR_LAMBDA_NAME!,
      InvocationType: "Event",
      Qualifier: "$LATEST",
      Payload: JSON.stringify(startEvent),
    })
    .promise();

  if (event.queryStringParameters?.waitSetup) {
    await promise;
  }
  return OK;
}
