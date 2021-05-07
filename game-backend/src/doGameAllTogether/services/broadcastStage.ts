import BaseGameContext from "../../gamebase/models/BaseGameContext";
import GatStage from "../models/GatStage";
import broadcast from "../../gamebase/network/broadcast";

export default async function broadcastStage({
  context,
  stage,
  age,
}: {
  context: BaseGameContext;
  stage: GatStage;
  age: number;
}): Promise<void> {
  await broadcast(Object.keys(context.connectedUsers), {
    type: "stage",
    payload: { stage, age },
  });
}
