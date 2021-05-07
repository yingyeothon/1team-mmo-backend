import { BaseGameContext } from "@yingyeothon/lambda-gamebase";
import GameStage from "../models/GameStage";
export default function broadcastStage({ context, stage, age, }: {
    context: BaseGameContext;
    stage: GameStage;
    age: number;
}): Promise<void>;
//# sourceMappingURL=broadcastStage.d.ts.map