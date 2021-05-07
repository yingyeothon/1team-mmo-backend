import { ConsoleLogger } from "@yingyeothon/logger";
import GameActorStartEvent from "../gamebase/actor/models/GameActorStartEvent";
import { Handler } from "aws-lambda";
import gameConstants from "./config/gameConstants";
import gameMain from "./gameMain";
import handleActor from "../gamebase/actor/handleActor";
import redisKeyPrefix from "../config/redisKeyPrefix";

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
