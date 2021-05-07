import { APIGatewayProxyHandler } from "aws-lambda";
import handleDisconnect from "../gamebase/handlers/handleDisconnect";
import redisKeyPrefix from "../config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleDisconnect({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
  });
