import { APIGatewayProxyHandler } from "aws-lambda";
import handleDisconnect from "@yingyeothon/lambda-gamebase/lib/handlers/handleDisconnect";
import redisKeyPrefix from "../lambda/config/redisKeyPrefix";

export const handle: APIGatewayProxyHandler = async (event) =>
  handleDisconnect({
    event,
    connectionIdAndGameIdKeyPrefix: redisKeyPrefix.connectionIdAndGameId,
    actorQueueKeyPrefix: redisKeyPrefix.actor.queue,
  });
