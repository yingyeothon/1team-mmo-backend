import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import handleDebugStart from "@yingyeothon/lambda-gamebase/lib/handlers/handleDebugStart";
import redisKeyPrefix from "../lambda/config/redisKeyPrefix";

export const handle: APIGatewayProxyHandlerV2 = async (event) =>
  handleDebugStart({ event, actorLockKeyPrefix: redisKeyPrefix.actor.lock });
