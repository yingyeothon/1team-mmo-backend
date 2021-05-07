import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import handleDebugStart from "../gamebase/handlers/handleDebugStart";
import redisKeyPrefix from "../config/redisKeyPrefix";

export const handle: APIGatewayProxyHandlerV2 = async (event) =>
  handleDebugStart({ event, actorLockKeyPrefix: redisKeyPrefix.actor.lock });
