import { Logger } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export interface NewActorSubsysArgs {
    awaiterKeyPrefix: string;
    queueKeyPrefix: string;
    lockKeyPrefix: string;
    lockTimeoutSeconds: number;
    redisConnection: RedisConnection;
    logger: Logger;
}
export default function newActorSubsys({ awaiterKeyPrefix, queueKeyPrefix, lockKeyPrefix, lockTimeoutSeconds, redisConnection, logger, }: NewActorSubsysArgs): {
    awaiter: {
        wait: (actorId: string, messageId: string, timeoutMillis: number) => Promise<boolean>;
        resolve: (actorId: string, messageId: string) => Promise<void>;
    };
    queue: {
        size: (actorId: string) => Promise<number>;
        flush: <T>(actorId: string) => Promise<T[]>;
    };
    lock: {
        release: (actorId: string) => Promise<boolean>;
        tryAcquire: (actorId: string) => Promise<boolean>;
    };
    logger: Logger;
};
//# sourceMappingURL=newActorSubsys.d.ts.map