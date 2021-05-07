import { Logger } from "@yingyeothon/logger";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import awaiterResolve from "@yingyeothon/actor-system-redis-support/lib/awaiter/resolve";
import awaiterWait from "@yingyeothon/actor-system-redis-support/lib/awaiter/wait";
import lockAcquire from "@yingyeothon/actor-system-redis-support/lib/lock/acquire";
import lockRelease from "@yingyeothon/actor-system-redis-support/lib/lock/release";
import queueFlush from "@yingyeothon/actor-system-redis-support/lib/queue/flush";
import queueSize from "@yingyeothon/actor-system-redis-support/lib/queue/size";

export interface NewActorSubsysArgs {
  awaiterKeyPrefix: string;
  queueKeyPrefix: string;
  lockKeyPrefix: string;
  lockTimeoutSeconds: number;
  redisConnection: RedisConnection;
  logger: Logger;
}

export default function newActorSubsys({
  awaiterKeyPrefix,
  queueKeyPrefix,
  lockKeyPrefix,
  lockTimeoutSeconds,
  redisConnection,
  logger,
}: NewActorSubsysArgs) {
  return {
    awaiter: {
      ...awaiterResolve({
        connection: redisConnection,
        keyPrefix: awaiterKeyPrefix,
        logger,
      }),
      ...awaiterWait({
        connection: redisConnection,
        keyPrefix: awaiterKeyPrefix,
        logger,
      }),
    },
    queue: {
      ...queueFlush({
        connection: redisConnection,
        keyPrefix: queueKeyPrefix,
        logger,
      }),
      ...queueSize({
        connection: redisConnection,
        keyPrefix: queueKeyPrefix,
        logger,
      }),
    },
    lock: {
      ...lockAcquire({
        connection: redisConnection,
        keyPrefix: lockKeyPrefix,
        logger,
        lockTimeout: lockTimeoutSeconds * 1000,
      }),
      ...lockRelease({
        connection: redisConnection,
        keyPrefix: lockKeyPrefix,
        logger,
      }),
    },
    logger,
  };
}
