import { ApiGatewayManagementApi } from "aws-sdk";
import { ConsoleLogger } from "@yingyeothon/logger";
import env from "../env/env";
import fakeConnectionId from "../env/fakeConnectionId";

const logger = new ConsoleLogger(
  process.env.STAGE === "production" ? `info` : `debug`
);

const apimgmt = new ApiGatewayManagementApi({
  endpoint: env.isOffline ? `http://localhost:3001` : env.webSocketEndpoint,
});

export default async function reply<T extends { type: string }>(
  connectionId: string,
  response: T
): Promise<boolean> {
  if (connectionId === fakeConnectionId) {
    return true;
  }
  try {
    await apimgmt
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(response),
      })
      .promise();
    logger.debug(`Reply`, connectionId, response);
    return true;
  } catch (error) {
    logger.error(`Cannot reply to`, connectionId, response, error);
    return false;
  }
}
