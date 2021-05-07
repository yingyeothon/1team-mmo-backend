import { APIGatewayProxyHandler } from "aws-lambda";
import { handleConnect } from "@yingyeothon/lambda-gamebase";
import redisKeyPrefix from "../config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleConnect({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorEventKeyPrefix: redisKeyPrefix.actor.event,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
  });
