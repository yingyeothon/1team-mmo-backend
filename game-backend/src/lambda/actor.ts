import { GameActorStartEvent, handleActor } from "@yingyeothon/lambda-gamebase";

import { ConsoleLogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import gameConstants from "../game/config/gameConstants";
import gameMain from "../game/gameMain";
import redisKeyPrefix from "./config/redisKeyPrefix";

const logger = new ConsoleLogger("debug");

export const handle: Handler<GameActorStartEvent, void> = async (event) =>
  handleActor({
    event,
    logger,
    eventKeyPrefix: redisKeyPrefix.actor.event,
    awaiterKeyPrefix: redisKeyPrefix.actor.awaiter,
    queueKeyPrefix: redisKeyPrefix.actor.queue,
    lockKeyPrefix: redisKeyPrefix.actor.lock,
    lifetimeSeconds: gameConstants.gameAliveSeconds,
    gameMain,
  });
