import { APIGatewayProxyHandler } from "aws-lambda";
import handleConnect from "../gamebase/handlers/handleConnect";
import redisKeyPrefix from "../config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleConnect({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorEventKeyPrefix: redisKeyPrefix.actor.event,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
  });
