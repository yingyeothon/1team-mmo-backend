import { APIGatewayProxyHandler } from "aws-lambda";
import handleMessages from "../gamebase/handlers/handleMessages";
import redisKeyPrefix from "../config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleMessages({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
    validateMessage: (maybe) => typeof maybe === "object",
  });
