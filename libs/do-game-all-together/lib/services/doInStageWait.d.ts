import { BaseGameContext, BaseGameRequest } from "@yingyeothon/lambda-gamebase";
import { Logger } from "@yingyeothon/logger";
export default function doInStageWait({ context, gameWaitingSeconds, loopInterval, pollMessages: pollMessages, logger, }: {
    context: BaseGameContext;
    gameWaitingSeconds: number;
    loopInterval: number;
    pollMessages: () => Promise<BaseGameRequest[]>;
    logger: Logger;
}): Promise<boolean>;
//# sourceMappingURL=doInStageWait.d.ts.map