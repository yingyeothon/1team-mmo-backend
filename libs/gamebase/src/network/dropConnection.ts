import { ApiGatewayManagementApi } from "aws-sdk";
import env from "../env";
import fakeConnectionId from "./fakeConnectionId";

const apimgmt = new ApiGatewayManagementApi({
  endpoint: env.isOffline ? `http://localhost:3001` : env.webSocketEndpoint,
});

export default async function dropConnection(
  connectionId: string
): Promise<boolean> {
  if (connectionId === fakeConnectionId) {
    return true;
  }
  try {
    apimgmt
      .deleteConnection({
        ConnectionId: connectionId,
      })
      .promise();
    return true;
  } catch (error) {
    return false;
  }
}
