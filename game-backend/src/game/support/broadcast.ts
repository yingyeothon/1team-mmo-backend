import { ConsoleLogger } from "@yingyeothon/logger";
import reply from "./reply";

const logger = new ConsoleLogger(
  process.env.STAGE === "production" ? `info` : `debug`
);

export interface RespondResult {
  [connectionId: string]: boolean;
}

export default async function broadcast<T extends { type: string }>(
  connectionIds: string[],
  response: T
): Promise<RespondResult> {
  const result = await Promise.all(
    connectionIds.map((connectionId) =>
      reply(connectionId, response).then(
        (success) =>
          ({
            [connectionId]: success,
          } as RespondResult)
      )
    )
  );
  const map = result.reduce(
    (acc, cur) => Object.assign(acc, cur),
    {} as RespondResult
  );
  logger.info(`Broadcast`, response, map);
  return map;
}
