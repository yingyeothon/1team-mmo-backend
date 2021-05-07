import {
  BaseGameRequest,
  GameMainArguments,
  broadcast,
} from "@yingyeothon/lambda-gamebase";

import { ConsoleLogger } from "@yingyeothon/logger";
import gameConstants from "./config/gameConstants";
import { runGameAllTogether } from "@yingyeothon/do-game-all-together";

const logger = new ConsoleLogger(
  process.env.STAGE === "production" ? "info" : "debug"
);

const loopInterval = 0;

export default async function gameMain({
  gameId,
  members,
  pollMessages,
}: GameMainArguments<BaseGameRequest>): Promise<void> {
  await runGameAllTogether({
    gameId,
    members,
    pollMessages,

    logger,
    loopInterval,

    gameWaitingSeconds: gameConstants.gameWaitingSeconds,
    gameRunningSeconds: gameConstants.gameRunningSeconds,

    isGameOver: ({ context }) =>
      Object.keys(context.connectedUsers).length === 0,
    processMessage: async ({ context, message }) => {
      await broadcast(
        [
          ...Object.keys(context.connectedUsers),
          ...context.observers.map((ob) => ob.connectionId).filter(Boolean),
        ],
        message
      );
    },
    updateTimeDelta: async () => {},
  });
}
