import { Logger } from "@yingyeothon/logger";
import GameActorStartEvent from "./models/GameActorStartEvent";
import GameMainArguments from "../models/GameMainArguments";
export default function handleActor<M>({ event, eventKeyPrefix, awaiterKeyPrefix, queueKeyPrefix, lockKeyPrefix, lifetimeSeconds, gameMain, logger, }: {
    event: GameActorStartEvent;
    eventKeyPrefix: string;
    awaiterKeyPrefix: string;
    queueKeyPrefix: string;
    lockKeyPrefix: string;
    lifetimeSeconds: number;
    gameMain: (args: GameMainArguments<M>) => Promise<unknown>;
    logger?: Logger;
}): Promise<void>;
//# sourceMappingURL=handleActor.d.ts.map