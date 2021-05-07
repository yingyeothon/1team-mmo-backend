import redisConnect, {
  RedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

import env from "../env";

export default async function useRedis<R>(
  work: (connection: RedisConnection) => Promise<R>,
  {
    host = env.redisHost,
    password = env.redisPassword,
  }: { host?: string; password?: string } = {}
): Promise<R> {
  const redisConnection = redisConnect({
    host,
    password,
  });
  try {
    const result = await work(redisConnection);
    return result;
  } finally {
    redisConnection.socket.disconnect();
  }
}
