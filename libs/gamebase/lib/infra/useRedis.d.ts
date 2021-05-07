import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function useRedis<R>(work: (connection: RedisConnection) => Promise<R>, { host, password, }?: {
    host?: string;
    password?: string;
}): Promise<R>;
//# sourceMappingURL=useRedis.d.ts.map