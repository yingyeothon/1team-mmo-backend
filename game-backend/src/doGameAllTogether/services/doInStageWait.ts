import BaseGameContext from "../../gamebase/models/BaseGameContext";
import BaseGameRequest from "../../gamebase/requests/BaseGameRequest";
import GatStage from "../models/GatStage";
import { Logger } from "@yingyeothon/logger";
import Ticker from "../../gamebase/support/Ticker";
import broadcastStage from "./broadcastStage";
import processEnterLeave from "./processEnterLeave";
import sleep from "../../gamebase/support/sleep";

export default async function doInStageWait({
  context,
  gameWaitingSeconds,
  loopInterval,
  pollMessages: pollMessages,
  logger,
}: {
  context: BaseGameContext;
  gameWaitingSeconds: number;
  loopInterval: number;
  pollMessages: () => Promise<BaseGameRequest[]>;
  logger: Logger;
}): Promise<boolean> {
  logger.info({ context }, "Start of wait stage");

  function isAllConnected() {
    return Object.keys(context.connectedUsers).length === context.users.length;
  }

  const ticker = new Ticker<GatStage>(GatStage.Wait, gameWaitingSeconds * 1000);
  while (ticker.isAlive() && !isAllConnected()) {
    const messages = await pollMessages();
    for (const message of messages) {
      try {
        await processEnterLeave({ context, message });
      } catch (error) {
        logger.error(
          { context, message, error },
          "Cannot process enter-leave message"
        );
      }
    }

    await ticker.checkAgeChanged((stage, age) =>
      broadcastStage({ context, stage, age })
    );
    await sleep(loopInterval);
  }

  logger.info({ context }, "End of wait stage");
  return isAllConnected();
}
