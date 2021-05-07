import { ConsoleLogger, Logger } from "@yingyeothon/logger";

import BaseGameRequest from "../gamebase/requests/BaseGameRequest";
import { GameController } from "./services/doInStageRunning";
import GameMainArguments from "../gamebase/models/GameMainArguments";
import GatStage from "./models/GatStage";
import broadcastStage from "./services/broadcastStage";
import doInStageRunning from "./services/doInStageRunning";
import doInStageWait from "./services/doInStageWait";
import dropConnection from "../gamebase/network/dropConnection";
import setupBaseGameContext from "../gamebase/support/setupBaseGameContext";

export default async function runGameAllTogether<M extends BaseGameRequest>({
  gameId,
  members,
  pollMessages,
  gameWaitingSeconds,
  gameRunningSeconds,
  isGameOver,
  processMessage,
  updateTimeDelta,
  loopInterval = 0,
  logger = new ConsoleLogger("debug"),
}: GameMainArguments<M> & {
  gameWaitingSeconds: number;
  gameRunningSeconds: number;
  loopInterval?: number;
  logger?: Logger;
} & GameController<M>) {
  const context = setupBaseGameContext(members);
  try {
    const allConnected = await doInStageWait({
      context,
      gameWaitingSeconds,
      loopInterval,
      pollMessages,
      logger,
    });
    if (allConnected) {
      await doInStageRunning({
        context,
        gameRunningSeconds,
        loopInterval,
        isGameOver,
        processMessage,
        updateTimeDelta,
        pollMessages,
        logger,
      });
    }
  } catch (error) {
    logger.error({ gameId, context, error }, "Error in game loop");
  }
  await broadcastStage({ context, age: 0, stage: GatStage.End });
  await Promise.all(
    Object.keys(context.connectedUsers).map((connectionId) =>
      dropConnection(connectionId)
    )
  );
  logger.info({ gameId, members }, "Game end");
}
