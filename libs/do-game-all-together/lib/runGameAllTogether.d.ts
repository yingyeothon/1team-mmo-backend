import { BaseGameRequest, GameMainArguments } from "@yingyeothon/lambda-gamebase";
import { Logger } from "@yingyeothon/logger";
import { GameController } from "./services/doInStageRunning";
export default function runGameAllTogether<M extends BaseGameRequest>({ gameId, members, pollMessages, gameWaitingSeconds, gameRunningSeconds, isGameOver, processMessage, updateTimeDelta, loopInterval, logger, }: GameMainArguments<M> & {
    gameWaitingSeconds: number;
    gameRunningSeconds: number;
    loopInterval?: number;
    logger?: Logger;
} & GameController<M>): Promise<void>;
//# sourceMappingURL=runGameAllTogether.d.ts.map