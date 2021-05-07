import { ActroEventLoopEnvironment } from "@yingyeothon/actor-system/lib/actor/eventLoop";
import GameMainArguments from "../models/GameMainArguments";
import GameStartMember from "../models/GameStartMember";
import { Logger } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export interface StartActorLoopArgs<M> {
    gameId: string;
    members: GameStartMember[];
    eventKeyPrefix: string;
    logger: Logger;
    subsys: Omit<ActroEventLoopEnvironment<M>, "id" | "loop">;
    redisConnection: RedisConnection;
    gameMain: (args: GameMainArguments<M>) => Promise<unknown>;
}
export default function startActorLoop<M>({ gameId, members, subsys, logger, eventKeyPrefix, redisConnection, gameMain, }: StartActorLoopArgs<M>): Promise<void>;
//# sourceMappingURL=startActorLoop.d.ts.map