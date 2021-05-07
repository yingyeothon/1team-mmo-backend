import { BaseGameContext, BaseGameRequest } from "@yingyeothon/lambda-gamebase";
import { Logger } from "@yingyeothon/logger";
export interface GameController<M extends BaseGameRequest> {
    isGameOver: ({ context }: {
        context: BaseGameContext;
    }) => boolean;
    processMessage: ({ context, message, }: {
        context: BaseGameContext;
        message: M;
    }) => Promise<unknown>;
    updateTimeDelta?: ({ context, delta, }: {
        context: BaseGameContext;
        delta: number;
    }) => Promise<unknown>;
}
export default function doInStageRunning<M extends BaseGameRequest>({ context, gameRunningSeconds, loopInterval, isGameOver, processMessage, updateTimeDelta, pollMessages, logger, }: {
    context: BaseGameContext;
    gameRunningSeconds: number;
    loopInterval: number;
    pollMessages: () => Promise<M[]>;
    logger: Logger;
} & GameController<M>): Promise<void>;
//# sourceMappingURL=doInStageRunning.d.ts.map