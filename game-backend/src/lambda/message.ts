import { APIGatewayProxyHandler } from "aws-lambda";
import handleMessages from "@yingyeothon/lambda-gamebase/lib/handlers/handleMessages";
import redisKeyPrefix from "../lambda/config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleMessages({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
    validateMessage: (maybe) => typeof maybe === "object",
  });
