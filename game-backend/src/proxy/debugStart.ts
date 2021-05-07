import { APIGatewayProxyHandler } from "aws-lambda";
import { ConsoleLogger } from "@yingyeothon/logger";
import { GameActorStartEvent } from "../shared/actorRequest";
import { Lambda } from "aws-sdk";
import actorSubsysKeys from "../env/actorSubsysKeys";
import env from "./support/env";
import lockRelease from "@yingyeothon/actor-system-redis-support/lib/lock/release";
import responses from "./support/responses";
import useRedis from "./support/useRedis";

const logger = new ConsoleLogger(`debug`);

export const handle: APIGatewayProxyHandler = async (event) => {
  if (!env.isOffline) {
    return responses.NotFound;
  }

  const startEvent = JSON.parse(event.body) as GameActorStartEvent;
  logger.debug(`Start for debugging`, startEvent);

  await useRedis(async (redisConnection) =>
    lockRelease({
      connection: redisConnection,
      keyPrefix: actorSubsysKeys.lockKeyPrefix,
      logger,
    }).release(startEvent.gameId)
  );
  logger.debug(`Release actor's lock`, startEvent.gameId);

  // Start a new Lambda to process game messages.
  const promise = new Lambda({
    endpoint: `http://localhost:3000`,
  })
    .invoke({
      FunctionName: env.gameActorLambdaName,
      InvocationType: "Event",
      Qualifier: "$LATEST",
      Payload: JSON.stringify(startEvent),
    })
    .promise();

  if (event.queryStringParameters?.waitSetup) {
    await promise;
  }
  return responses.OK;
};
