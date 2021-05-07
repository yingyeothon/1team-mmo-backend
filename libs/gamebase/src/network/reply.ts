import { ApiGatewayManagementApi } from "aws-sdk";
import { ConsoleLogger } from "@yingyeothon/logger";
import env from "../env";
import fakeConnectionId from "../network/fakeConnectionId";

const logger = new ConsoleLogger(
  process.env.STAGE === "production" ? "info" : "debug"
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
    logger.debug({ connectionId, response }, "Reply");
    return true;
  } catch (error) {
    logger.error({ connectionId, response, error }, "Cannot reply to");
    return false;
  }
}
