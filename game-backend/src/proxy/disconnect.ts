import { APIGatewayProxyHandler } from "aws-lambda";
import { handleDisconnect } from "@yingyeothon/lambda-gamebase";
import redisKeyPrefix from "../config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleDisconnect({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
  });
