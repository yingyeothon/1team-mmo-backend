import {
  BaseGameContext,
  BaseGameRequest,
  Ticker,
  TimeDelta,
  sleep,
} from "@yingyeothon/lambda-gamebase";

import GameStage from "../models/GameStage";
import { Logger } from "@yingyeothon/logger";
import broadcastStage from "./broadcastStage";
import processEnterLeave from "./processEnterLeave";

export interface GameController<M extends BaseGameRequest> {
  isGameOver: ({ context }: { context: BaseGameContext }) => boolean;
  processMessage: ({
    context,
    message,
  }: {
    context: BaseGameContext;
    message: M;
  }) => Promise<unknown>;
  updateTimeDelta?: ({
    context,
    delta,
  }: {
    context: BaseGameContext;
    delta: number;
  }) => Promise<unknown>;
}

export default async function doInStageRunning<M extends BaseGameRequest>({
  context,
  gameRunningSeconds,
  loopInterval,
  isGameOver,
  processMessage,
  updateTimeDelta,
  pollMessages,
  logger,
}: {
  context: BaseGameContext;
  gameRunningSeconds: number;
  loopInterval: number;
  pollMessages: () => Promise<M[]>;
  logger: Logger;
} & GameController<M>) {
  logger.info({ context }, "Start of running stage");

  const timeDelta = new TimeDelta();
  const ticker = new Ticker<GameStage>(
    GameStage.Running,
    gameRunningSeconds * 1000
  );
  while (ticker.isAlive() && !isGameOver({ context })) {
    const messages = await pollMessages();
    for (const message of messages) {
      try {
        if (message.type === "enter" || message.type === "leave") {
          await processEnterLeave({ context, message });
        } else {
          await processMessage({ context, message });
        }
      } catch (error) {
        logger.error({ context, message, error }, "Cannot process message");
      }
      if (updateTimeDelta) {
        const delta = timeDelta.getDelta();
        try {
          await updateTimeDelta({ context, delta });
        } catch (error) {
          logger.error(
            { context, delta, error },
            "Cannot update with time-delta"
          );
        }
      }
    }

    await ticker.checkAgeChanged((stage, age) =>
      broadcastStage({ context, stage, age })
    );
    await sleep(loopInterval);
  }

  logger.info({ context }, "End of running stage");
}
