import env from "../env/env";
import fakeConnectionId from "../env/fakeConnectionId";
import { newApiGatewayManagementApi } from "@yingyeothon/aws-apigateway-management-api";

export default async function dropConnection(
  connectionId: string
): Promise<boolean> {
  if (connectionId === fakeConnectionId) {
    return true;
  }
  try {
    await newApiGatewayManagementApi({
      endpoint: env.isOffline ? `http://localhost:3001` : env.webSocketEndpoint,
    })
      .deleteConnection({
        ConnectionId: connectionId,
      })
      .promise();
    return true;
  } catch (error) {
    return false;
  }
}
