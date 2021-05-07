import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export default function handleDisconnect({ event, connectionIdAndGameIdKeyPrefix, actorQueueKeyPrefix, }: {
    event: APIGatewayProxyEvent;
    connectionIdAndGameIdKeyPrefix: string;
    actorQueueKeyPrefix: string;
}): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=handleDisconnect.d.ts.map