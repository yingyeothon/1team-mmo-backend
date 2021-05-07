import { BaseGameContext, broadcast } from "@yingyeothon/lambda-gamebase";

import GameStage from "../models/GameStage";

export default async function broadcastStage({
  context,
  stage,
  age,
}: {
  context: BaseGameContext;
  stage: GameStage;
  age: number;
}): Promise<void> {
  await broadcast(Object.keys(context.connectedUsers), {
    type: "stage",
    payload: { stage, age },
  });
}
